"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.templateTags = exports.requestHooks = void 0;
const auth_1 = require("@aws-amplify/auth");
const core_1 = require("@aws-amplify/core");
const AWS = require("aws-sdk");
const users = {};
const HEADER_FLAG = "InsomniaPluginAWSIAM";
exports.requestHooks = [(context) => __awaiter(void 0, void 0, void 0, function* () {
        const key = context.request.getHeader(HEADER_FLAG);
        context.request.removeHeader(HEADER_FLAG);
        if (users[key]) {
            const method = context.request.getMethod();
            const body = context.request.getBody();
            const url = context.request.getUrl();
            const existingHeaders = Object.assign({}, ...context.request.getHeaders().map((header) => {
                return { [header.name]: header.value };
            }));
            const { accessKeyId, secretAccessKey, sessionToken } = users[key].credentials;
            const formatted = {
                method,
                url,
                data: body.text,
                headers: Object.assign({ accept: "*/*", "Content-Type": "application/json; charset=UTF-8" }, existingHeaders),
            };
            try {
                var { headers } = yield core_1.Signer.sign(formatted, {
                    access_key: accessKeyId,
                    secret_key: secretAccessKey,
                    session_token: sessionToken,
                });
            }
            catch (e) {
                console.log("Error signing headers", e);
            }
            if (headers) {
                for (const key in headers) {
                    context.request.setHeader(key, headers[key]);
                }
            }
        }
    })];
const run = (context, Username, Password, Region, IdentityPoolId, UserPoolId, ClientId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!Username) {
        throw new Error("Username attribute is required");
    }
    if (!Password) {
        throw new Error("Password attribute is required");
    }
    if (!Region) {
        throw new Error("Region attribute is required");
    }
    if (!IdentityPoolId) {
        throw new Error("IdentityPoolId attribute is required");
    }
    if (!ClientId) {
        throw new Error("ClientId attribute is required");
    }
    if (!UserPoolId) {
        throw new Error("UserPoolId attribute is required");
    }
    const key = `${Username}-${UserPoolId}`;
    let creds;
    if (users[key]) {
        const { accessKeyId, secretAccessKey, sessionToken } = users[key].credentials;
        creds = new AWS.Credentials(accessKeyId, secretAccessKey, sessionToken);
    }
    if (!users[key] || (creds === null || creds === void 0 ? void 0 : creds.expired)) {
        auth_1.Auth.configure({
            region: Region,
            identityPoolId: IdentityPoolId,
            userPoolId: UserPoolId,
            userPoolWebClientId: ClientId
        });
        try {
            users[key] = {
                user: yield auth_1.Auth.signIn(Username, Password),
                credentials: yield auth_1.Auth.currentCredentials()
            };
        }
        catch (e) {
            console.log("Error Authentication", e);
        }
    }
    return Promise.resolve(key);
});
exports.templateTags = [
    {
        name: "AwsCognitoIAM",
        displayName: "AWS Cognito IAM",
        description: "Plugin for Insomnia to provide AWS V4 sign from AWS Cognito",
        args: [
            {
                displayName: "Username",
                type: "string",
                validate: (arg) => (arg ? "" : "Required"),
            },
            {
                displayName: "Password",
                type: "string",
                validate: (arg) => (arg ? "" : "Required"),
            },
            {
                displayName: "Region",
                type: "string",
                validate: (arg) => (arg ? "" : "Required"),
            },
            {
                displayName: "IdentityPoolId",
                type: "string",
                validate: (arg) => (arg ? "" : "Required"),
            },
            {
                displayName: "UserPoolId",
                type: "string",
                validate: (arg) => (arg ? "" : "Required"),
            },
            {
                displayName: "ClientId",
                type: "string",
                validate: (arg) => (arg ? "" : "Required"),
            },
        ],
        run,
    },
];
//# sourceMappingURL=index.js.map