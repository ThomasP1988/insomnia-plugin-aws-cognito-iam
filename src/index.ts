import { Auth } from '@aws-amplify/auth';
import { Signer, ICredentials } from "@aws-amplify/core";
import { CognitoUser } from 'amazon-cognito-identity-js';
import * as AWS from 'aws-sdk';

const users: { [id: string]: { user: CognitoUser, credentials: ICredentials } } = {};

const HEADER_FLAG: string = "InsomniaPluginAWSIAM";

export const requestHooks = [async (context: Insomnia.Context): Promise<void> => {

    const key: string = context.request.getHeader(HEADER_FLAG);
    context.request.removeHeader(HEADER_FLAG);

    if (users[key]) {

        const method: string = context.request.getMethod();
        const body: any = context.request.getBody();
        const url: string = context.request.getUrl();
        const existingHeaders: { [name: string]: string } = Object.assign({}, ...context.request.getHeaders().map((header: { name: string, value: string }): { [name: string]: string } => {
            return { [header.name]: header.value };
        }));

        const { accessKeyId, secretAccessKey, sessionToken } = users[key].credentials;
        const formatted: any = {
            method,
            url,
            data: body.text,
            headers: {
                accept: "*/*",
                "Content-Type": "application/json; charset=UTF-8",
                ...existingHeaders,
            },
        };

        try {
            var { headers } = await Signer.sign(formatted, {
                access_key: accessKeyId,
                secret_key: secretAccessKey,
                session_token: sessionToken,
            });
        } catch (e) {
            console.log("Error signing headers", e);
        }

        if (headers) {
            for (const key in headers) {
                context.request.setHeader(key, headers[key]);
            }
        }
    }
}];

const run = async (context: Insomnia.Context,
    Username: string,
    Password: string,
    Region: string,
    IdentityPoolId: string,
    UserPoolId: string,
    ClientId: string,
): Promise<string> => {

    if (!Username) {
        throw new Error("Username attribute is required")
    }
    if (!Password) {
        throw new Error("Password attribute is required")
    }
    if (!Region) {
        throw new Error("Region attribute is required")
    }
    if (!IdentityPoolId) {
        throw new Error("IdentityPoolId attribute is required")
    }
    if (!ClientId) {
        throw new Error("ClientId attribute is required")
    }
    if (!UserPoolId) {
        throw new Error("UserPoolId attribute is required")
    }

    const key: string = `${Username}-${UserPoolId}`;

    let creds: AWS.Credentials;

    if (users[key]) {
        const { accessKeyId, secretAccessKey, sessionToken } = users[key].credentials;
        creds = new AWS.Credentials(accessKeyId, secretAccessKey, sessionToken);
    }

    if (!users[key] || creds?.expired) {
        Auth.configure({
            region: Region,
            identityPoolId: IdentityPoolId,
            userPoolId: UserPoolId,
            userPoolWebClientId: ClientId
        });

        try {
            users[key] = {
                user: await Auth.signIn(Username, Password),
                credentials: await Auth.currentCredentials()
            };
        } catch (e) {
            console.log("Error Authentication", e);
        }
    }

    return Promise.resolve(key);

};

export const templateTags = [
    {
        name: "AwsCognitoIAM",
        displayName: "AWS Cognito IAM",
        description: "Plugin for Insomnia to provide AWS V4 sign from AWS Cognito",
        args: [
            {
                displayName: "Username",
                type: "string",
                validate: (arg: string) => (arg ? "" : "Required"),
            },
            {
                displayName: "Password",
                type: "string",
                validate: (arg: string) => (arg ? "" : "Required"),
            },
            {
                displayName: "Region",
                type: "string",
                validate: (arg: string) => (arg ? "" : "Required"),
            },
            {
                displayName: "IdentityPoolId",
                type: "string",
                validate: (arg: string) => (arg ? "" : "Required"),
            },
            {
                displayName: "UserPoolId",
                type: "string",
                validate: (arg: string) => (arg ? "" : "Required"),
            },
            {
                displayName: "ClientId",
                type: "string",
                validate: (arg: string) => (arg ? "" : "Required"),
            },
        ],
        run,
    },
];
