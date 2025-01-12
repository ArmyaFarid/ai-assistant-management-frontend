import {ReactNode} from "react";
import {CustomApiClient} from "./CustomApiClientProvider";

export interface RequestOptions {
    token?: string; // JWT token
    noAuth? : boolean;
    // Add other request-specific options as needed
}

export interface CustomApiClientProviderProps {
    children: ReactNode;
    value: CustomApiClient; // Add a prop to accept the custom client instance
}


// export interface HttpGetHookReturnType {
//     data: any | null;
//     loading: boolean;
//     error: Error | null;
//     refetch: () => void;
// }

export interface HttpGetHookReturnType<T> {
    data: T | null;
    metadata:any;
    loading: boolean;
    error: Error | null;
    refetch: (url?:string) => void;
}

// export type HttpPostHookReturnType = [
//     postData: (body: any) => Promise<any>,
//     {
//         data: any | null;
//         loading: boolean;
//         error: Error | null;
//         resetData: () => void;
//     }
// ];

export type HttpPostHookReturnType = [
    (body: any) => Promise<any>,
    {
        response: any | null;
        loading: boolean;
        error: Error | null;
        resetData: () => void;
    }
];




export type HttpPutHookReturnType = [
    (id: string, body: any) => Promise<any>,
    {
        response: any | null;
        loading: boolean;
        error: Error | null;
        resetData: () => void;
    }
];

export type HttpDeleteHookReturnType = [
    (id: string) => Promise<any>,
    {
        loading: boolean;
        error: Error | null;
    }
];

export type UserCredential={
    email:string,
    password:string;
}


export type HttpPatchHookReturnType = [
    (id: string, body: any) => void,
    {
        response: any | null;
        loading: boolean;
        error: Error | null;
        resetData: () => void;
    }
];

export type LoginReturnType<T> =[
    (userCredential: UserCredential) => Promise<T>,
    {
        loading: boolean;
        error: string;
        isConnected: boolean;
        userData: T | null; // Replace with the actual user data type
        token: string | null;
    }
];

export type LogoutReturnType = [
    () => Promise<boolean|undefined>,
    { loading: boolean; error: string; isLoggedOut: boolean }
];


export type AuthenticatedUserHook<T> =
    {
        loading: boolean;
        error: string;
        isConnected: boolean;
        user: T | null ; // Replace with the actual user data type
        token: string | null;
    }
    ;
