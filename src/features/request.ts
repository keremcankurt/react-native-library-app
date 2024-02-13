async function request(url: string, data: any = false, method: string = 'GET', ContentType: string = ''): Promise<Response> {
    const options: RequestInit = {
        method,
        credentials: 'include'
    };

    if (data && method !== 'GET') {
        options.body = data;
        if (ContentType !== '') {
            options.headers = {
                'Content-Type': ContentType
            };
        }
    }
    return await fetch(url, options);
}

export const post = async (url: string, data: any, ContentType: string): Promise<Response> => {
    return await request(url, data, 'POST', ContentType);
};

export const put = async (url: string, data: any, ContentType: string): Promise<Response> => {
    return await request(url, data, 'PUT', ContentType);
};

export const del = async (url: string, data: any, ContentType: string): Promise<Response> => {
    return await request(url, data, 'DELETE', ContentType);
};

export const get = async (url: string): Promise<Response> => {
    return await request(url);
};
