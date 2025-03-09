import {CustomApiClient} from "@/lib/services/api/CustomApiClientProvider";
import {API_BASE_URL} from "@/config/environments";

const customClient = new CustomApiClient(API_BASE_URL);

type List = string[];

export const getSectorList  = async () : Promise<List | null>=>{
    return new Promise<List | null>(async (resolve, reject) => {
        try{
            const response = await customClient.fetch(`/data/sectors`, 'GET')
            if (response.ok){
                const data = await response.json();
                resolve(data as List);
            }else{
                resolve(null);
            }
        }catch (e) {
            resolve(null);
            reject(e);
        }
    });
}


export const getAssistantModes  = async () : Promise<List | null>=>{
    return getList('/data/assistant/modes');
}


const getList = (endpoint : string)=> {
    return new Promise<List | null>(async (resolve, reject) => {
        try{
            const response = await customClient.fetch(endpoint, 'GET')
            if (response.ok){
                const data = await response.json();
                resolve(data as List);
            }else{
                resolve(null);
            }
        }catch (e) {
            resolve(null);
            reject(e);
        }
    });
}
