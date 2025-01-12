
import React, { createContext, useContext, ReactNode } from 'react';
import {CustomApiClientProviderProps, RequestOptions} from "./types";

// const CustomApiClientContext = createContext<CustomApiClientContextType | undefined>(undefined);

const CustomApiClientContext = createContext<CustomApiClient | undefined>(undefined);

class CustomApiClient {
    private baseURL: string;
    private jwtToken: string | null = null; // Store the JWT token here


    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    setJwtToken(token: string | null) {
        this.jwtToken = token;
    }

    async fetch(endpoint: string, method = 'GET', body: any = null, options: RequestOptions = {} ) {
        const lUserToken = localStorage.getItem("token");
        if(lUserToken){
            this.setJwtToken(JSON.parse(lUserToken))
        }
        let token = this.jwtToken;

        if (options.token) {
            token = options.token
        }

        const headers: HeadersInit = {
            // 'Content-Type': 'application/json',
        };

        if (token) {
            if(options.noAuth == false || options.noAuth == undefined){
                headers['Authorization'] = `Bearer ${token}`;
            }
        }

        const requestOptions: RequestInit = {
            method,
            headers,
        };



        if (body instanceof FormData) {
            // If body is FormData (likely containing file data), no need to stringify
            requestOptions.body = body;
            // headers['Content-Type'] = '';
        } else if (body) {
            // If body is not FormData, stringify it
            requestOptions.body = JSON.stringify(body);
            headers['Content-Type'] = 'application/json';
        }

        headers['Accept'] = 'application/json';

        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, requestOptions);
            // if (!response.ok) {
            //     throw new Error('Network response was not ok');
            // }
            const code = response.status;
            return response;
        } catch (error) {
            console.error(error)
            throw new Error('Error fetching data');
        }
    }
}

function CustomApiClientProvider({ children , value}: CustomApiClientProviderProps) {
    return (
        <CustomApiClientContext.Provider value={value}>
            {children}
        </CustomApiClientContext.Provider>
    );
}

function useCustomApiClient() {
    const context = useContext(CustomApiClientContext);
    if (!context) {
        throw new Error('useCustomApiClient must be used within a CustomApiClientProvider');
    }
    return context;
}

export { CustomApiClient,CustomApiClientProvider, useCustomApiClient };
