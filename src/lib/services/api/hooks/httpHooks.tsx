import { useEffect, useState } from 'react';
import { useCustomApiClient } from '../CustomApiClientProvider';
import {
    HttpDeleteHookReturnType,
    HttpGetHookReturnType, HttpPatchHookReturnType,
    HttpPostHookReturnType,
    HttpPutHookReturnType, LoginReturnType, LogoutReturnType,
    RequestOptions, UserCredential
} from "../types";

export function useHttpGet<T>(url: string, options: RequestOptions = {}): {
    metadata: any;
    data: T | null;
    response: any;
    refetch: (url?: string) => void;
    loading: boolean;
    error: Error | null
} {
    const apiClient = useCustomApiClient();
    const [response, setResponse] = useState<any | null>(null);
    const [data, setData] = useState<T | null>(null);
    const [metadata, setMetadata] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = async (refetchUrl?:string) => {
        setLoading(true);
        setError(null);
        let apiUrl = url;
        if (refetchUrl) apiUrl=refetchUrl

        try {
            const responseData = await apiClient.fetch(apiUrl, 'GET',null,options);
            setResponse(responseData)
            const toJson = await responseData.json();
            if(!responseData.ok){
                setError(new Error("server error"));
            }
            setMetadata(toJson.meta)
            setData(toJson.data);
        } catch (error:any) {
            console.log(error)
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(); // Automatically fetch data when the hook is used
    }, []);

    const refetch = (url?:string) => {
        fetchData(url);
    };

    return { data,metadata,response, loading, error, refetch };
}
export function useHttpPost(url: string, options: RequestOptions = {}): HttpPostHookReturnType {
    const apiClient = useCustomApiClient();



    const [response, setResponse] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const postData = async (body: any, customUrl?: string) : Promise<Response> => {
        return new Promise<Response>(async (resolve, reject)=>{
            setLoading(true);
            setError(null);

            try {
                const apiUrl = customUrl || url || ''; // Use customUrl if provided, then url, then empty string
                const responseData = await apiClient.fetch(apiUrl, 'POST', body,options);
                console.log(responseData);
                setResponse(responseData);
                resolve(responseData)
                // return responseData;
            } catch (error:any) {
                setError(error);
                throw new Error(error);
                // reject(error);
            } finally {
                setLoading(false);
            }
        })

    };

    const resetData = () => {
        setResponse(null);
    };

    return [postData,{ response, loading, error , resetData }];
}
export function useHttpPut(baseUrl: string, options: RequestOptions = {}): HttpPutHookReturnType {
    const apiClient = useCustomApiClient();

    const [response, setResponse] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const putData = async (id: string, body: any) => {
        setLoading(true);
        setError(null);

        try {
            const url = `${baseUrl}/${id}`;
            const responseData = await apiClient.fetch(url, 'PUT', body,options);
            setResponse(responseData);
            return responseData
        } catch (error: any) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    const resetData = () => {
        setResponse(null);
    };

    return [putData, { response: response, loading, error, resetData }];
}
export function useHttpPatch(baseUrl: string, options: RequestOptions = {}): HttpPatchHookReturnType {
    const apiClient = useCustomApiClient();

    const [response, setResponse] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const patchData = async (id: string, body: any) => {
        setLoading(true);
        setError(null);

        try {
            const url = `${baseUrl}${id}/`;
            const responseData = await apiClient.fetch(url, 'PATCH', body,options);
            setResponse(responseData);
            return responseData;
        } catch (error: any) {
            setError(error);
            throw new Error("Can't patch");
        } finally {
            setLoading(false);
        }
    };

    const resetData = () => {
        setResponse(null);
    };

    return [patchData, { response, loading, error, resetData }];
}
export function useHttpDelete(baseUrl: string, options: RequestOptions = {}): HttpDeleteHookReturnType {
    const apiClient = useCustomApiClient();

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const deleteData = async (id: string) => {
        setLoading(true);
        setError(null);

        try {
            const url = `${baseUrl}/${id}`;
            const response = await apiClient.fetch(url, 'DELETE',null,options);
            return response
        } catch (error: any) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    return [deleteData, { loading, error }];
}







