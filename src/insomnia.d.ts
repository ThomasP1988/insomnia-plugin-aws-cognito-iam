declare module Insomnia {
    type Context = {
        request: RequestContext,
        response: ReponseContext,
        store: StoreContext,
        app: AppContext,
        data: DataContext,
        network: NetworkContext
    }

    type RequestContext = {
        getId(): string,
        getName(): string,
        getUrl(): string,
        setUrl(url: string): void,
        getMethod(): string,
        getHeader(name: string): string | null,
        getHeaders(): any[],
        hasHeader(name: string): boolean,
        removeHeader(name: string): void,
        setHeader(name: string, value: string): void,
        addHeader(name: string, value: string): void,
        getParameter(name: string): string | null,
        getParameters(): Array<{ name: string, value: string }>,
        setParameter(name: string, value: string): void,
        hasParameter(name: string): boolean,
        addParameter(name: string, value: string): void,
        removeParameter(name: string): void,
        setBodyText(text: string): void,
        getBody(): any,
        getBodyText(): string,
        setCookie(name: string, value: string): void,
        getEnvironmentVariable(name: string): any,
        getEnvironment(): Object,
        setAuthenticationParameter(string: any): void,
        getAuthentication(): Object,
        setCookie(name: string, value: string): void,
        settingSendCookies(enabled: boolean): void,
        settingStoreCookies(enabled: boolean): void,
        settingEncodeUrl(enabled: boolean): void,
        settingDisableRenderRequestBody(enabled: boolean): void,
    }

    type ReponseContext = {
        getRequestId(): string;
        getStatusCode(): number
        getStatusMessage(): string
        getBytesRead(): number
        getTime(): number
        getBody(): any | null
        setBody(body: any): any
        getHeader(name: string): string | Array<string> | null
        hasHeader(name: string): boolean
    }

    type StoreContext = {
        hasItem(key: string): Promise<boolean>
        setItem(key: string, value: string): Promise<void>
        getItem(key: string): Promise<string | null>
        removeItem(key: string): Promise<void>
        clear(): Promise<void>
        all(): Promise<Array<{ key: string, value: string }>>
    }

    type AppContext = {
        alert(title: string, message?: string): Promise<void>
        prompt(title: string, options?: {
            label?: string,
            defaultValue?: string,
            submitName?: string,
            cancelable?: boolean,
        }): Promise<string>
        getPath(name: 'desktop'): string
        showSaveDialog(options: { defaultPath?: string }): Promise<string | null>
    }

    type DataContext = {
        uri(uri: string, options: { workspaceId?: string }): Promise<void>
        raw(text: string, options: { workspaceId?: string }): Promise<void>
        insomnia(options: {
            includePrivate?: boolean,
            format?: 'json' | 'yaml'
        }): Promise<string>
        har(options: { includePrivate?: boolean }): Promise<string>
    }

    type NetworkContext = {
        sendRequest(request: Request): Promise<Response>
    }

}
