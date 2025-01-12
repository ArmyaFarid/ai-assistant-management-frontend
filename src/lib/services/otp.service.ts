import {CustomApiClient} from "@/lib/services/api/CustomApiClientProvider";
import {API_BASE_URL} from "@/config/environments";

const customClient = new CustomApiClient(API_BASE_URL);


export const sendOTP  = async (email:string) : Promise<boolean>=>{
    return new Promise<boolean>(async (resolve, reject) => {
        try{
            const response = await customClient.fetch(`/data/sendOtp?email=${email}`, 'POST')
            if (response.ok){
                const data = await response.json();
                resolve(true);
            }else{
                resolve(false);
            }
        }catch (e) {
            resolve(false);
            reject(e);
        }
    });
}

export const verifyOpt  = async (email: string , otp: string) : Promise<Boolean>=>{
    return new Promise<Boolean>(async (resolve, reject) => {
        try{
            const response = await customClient.fetch(`/data/verifyOtp?email=${email}&otp=${otp}`, 'POST')
            if (response.ok){
                const data = await response.json();
                resolve(true);
            }else{
                resolve(true);
            }
        }catch (e) {
            resolve(true);
            reject(e);
        }
    });
}



