"use client";
import {useEffect, useState} from "react";
import {CustomApiClient, useCustomApiClient} from "@/lib/services/api/CustomApiClientProvider";
import {User} from "@/lib/definitions";
import {usePathname, useRouter} from "next/navigation";
import {
    AuthenticatedUserHook,
    LoginReturnType,
    LogoutReturnType,
    RequestOptions,
    UserCredential
} from "@/lib/services/api/types";
import {UserRole} from "@/lib/roles";

type UserProtectedProps = {
    redirectUrl : string;
    allowRoleOnly? : string[];
}

export function useProtected ({redirectUrl , allowRoleOnly}: UserProtectedProps){
    const customApiClient = useCustomApiClient();
    const [authenticationLoading , setAuthenticationLoading] = useState(true);
    const [isAuthenticated , setIsAuthenticated] = useState<boolean>(false);
    const router = useRouter();
    const pathname = usePathname()

    async function authenticate(token: string, customApiClient: CustomApiClient) {
        const isTokenValid = await checkToken(token, customApiClient);
        if (isTokenValid) {
            if (allowRoleOnly) {
                const role = await getLoggedUserRole(token, customApiClient);
                const isRoleAllowed = allowRoleOnly.includes(role);
                if (isRoleAllowed) {
                    setIsAuthenticated(isTokenValid);
                } else {
                    return router.push('/forbidden');
                    setIsAuthenticated(false);
                }
            } else {
                setIsAuthenticated(isTokenValid);
            }
        } else {
            clearAuthLocalStorage();
            setIsAuthenticated(isTokenValid);
        }
        setAuthenticationLoading(false);
    }

    useEffect(() => {
        setAuthenticationLoading(true);
        const token = localStorage.getItem("token");

        // Check if the token exists and is not empty
        const lUserToken = token ? JSON.parse(token) : null;
        if(lUserToken){
            authenticate(lUserToken,customApiClient);
            customApiClient.setJwtToken(lUserToken);
        }else{
            setAuthenticationLoading(false);
            setIsAuthenticated(false);
        }
    }, [pathname]);


    if (!authenticationLoading) {
        if (isAuthenticated) {
            return {authenticationLoading , isAuthenticated};
        } else {
            router.push(redirectUrl);
            return {authenticationLoading , isAuthenticated};
        }
    }else{
        return {authenticationLoading , isAuthenticated};
    }
}

const checkToken =  (token:string , client : CustomApiClient) : Promise<boolean> => {
    return new Promise<boolean>(async (resolve, reject) => {
        resolve(true);
        try {
            const response = await client.fetch('/check-token', 'POST', {token: token});
            const data = await response.json()
            if (response.ok) {
                const userInfoResponse = await client.fetch("/users/info", 'GET', null, {token: data.access_token});
                const loggedUser = await userInfoResponse.json();
                localStorage.setItem(
                    'user',
                    JSON.stringify(loggedUser)
                );
                resolve(true);
            } else {
                resolve(true);
            }
        } catch (e: any) {
            console.log(e);
            resolve(true);
        }
    })
};


const getLoggedUserRole =  (token:string , client : CustomApiClient) : Promise<UserRole> => {
    return new Promise<UserRole >(async (resolve, reject) => {
        try {
            const userInfoResponse = await client.fetch("/users/info", 'GET', null, {token: token});
            const loggedUser : User = (await userInfoResponse.json())?.data;
            const role  = loggedUser.role ?? "" ;
            resolve(role as UserRole);
        } catch (e: any) {
            console.log(e);
            resolve("" as UserRole);
        }
    })
};


function clearAuthLocalStorage() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('connected');
}

export function useLogin<T>(loginEndpoint: string, options: RequestOptions = {}): LoginReturnType<T> {
    const apiClient = useCustomApiClient();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [userData, setUserData] = useState<T | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(()=>{
        setLoading(true);
        const lUserData = localStorage.getItem("user");
        const lUserToken = localStorage.getItem("token");
        if (lUserToken) {
            // JSON.parse(isConnected) ? setIsConnected(true) : setIsConnected(false)
            checkToken(JSON.parse(lUserToken), apiClient).then((isAuthed)=>{
                if(isAuthed){
                    setIsConnected(true);
                    setUserData(JSON.parse(lUserData ?? ''))
                    setToken(JSON.parse(lUserToken) ?? '');
                }else{
                    setIsConnected(false);
                    setUserData(null)
                    setToken(null);
                    clearAuthLocalStorage();
                }
            }).finally(()=>{setLoading(false)});
        } else {
            setIsConnected(false);
            setUserData(null)
            setToken(null);
        }

    },[])


    const login = async (userCredential:UserCredential) : Promise<T> => {
        return new Promise<T>(async (resolve, reject) => {
            clearAuthLocalStorage();
            setLoading(true);
            setIsConnected(false);
            setUserData(null);
            try {
                const response = await apiClient.fetch(loginEndpoint, 'POST', userCredential, options);
                const data = await response.json()
                let loggedUser: any = {};
                if (response.ok && data.token) {
                    localStorage.setItem(
                        'token',
                        JSON.stringify(data.token)
                    );
                    setToken(data.token);
                    const userInfoResponse = await apiClient.fetch("/users/me", 'GET', null, {token: data.access_token});
                    loggedUser = await userInfoResponse.json();
                    localStorage.setItem(
                        'user',
                        JSON.stringify(loggedUser?.data)
                    );
                    setIsConnected(true);
                    setUserData(loggedUser?.data);
                    resolve(loggedUser?.data);
                } else {
                    setIsConnected(false);
                    setUserData(null);
                    reject("no token generated")
                }
            } catch (e: any) {
                console.log(e)
                if (e.message === 'Network Error') {
                    setError('Network error occurred.');
                } else {
                    setError('Invalid credentials. Please try again.'); // Customize the error message as needed
                }
                throw new Error(error);
            } finally {
                setLoading(false);
            }
        })
    };

    return [login,{ loading, error, isConnected, userData , token }];
}

export function useLogout(logoutEndpoint: string): LogoutReturnType {
    const apiClient = useCustomApiClient();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isLoggedOut, setIsLoggedOut] = useState(false);

    const logout = async () : Promise<boolean|undefined> => {
        setLoading(true);
        try {
            const lUserRefreshToken = JSON.parse(localStorage.getItem("refresh_token") ?? "");
            if(lUserRefreshToken){
                const response = await apiClient.fetch(logoutEndpoint+`?refreshToken=${lUserRefreshToken}`, 'POST');
                if(response.ok && response.status == 200 ){
                    clearAuthLocalStorage();
                    setIsLoggedOut(true);
                    return true;
                }
            }else{
                return false;
            }
        } catch (e) {
            console.log(e);
            setError('Error occurred during logout.'); // Customize the error message as needed
            throw new Error(error);
        } finally {
            setLoading(false);
        }
    };

    return [logout, { loading, error, isLoggedOut }];
}

export function useAuthenticatedUser<T>(): AuthenticatedUserHook<T> {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [user, setUserData] = useState<T | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(()=>{
        setLoading(true);
        const lUserData = localStorage.getItem("user");
        const lUserToken = localStorage.getItem("token");
        if (lUserToken) {
            setUserData(JSON.parse(lUserData ?? ''))
        } else {
            setIsConnected(false);
            setUserData(null)
            setToken(null);
        }

    },[])


    return { loading, error, isConnected, user , token };
}


