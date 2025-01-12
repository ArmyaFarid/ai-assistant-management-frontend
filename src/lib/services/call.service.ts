import {CustomApiClient} from "@/lib/services/api/CustomApiClientProvider";
import {API_BASE_URL} from "@/config/environments";

const customClient = new CustomApiClient(API_BASE_URL);


export const changeCallState  = async (id:number , state : string) : Promise<boolean>=>{
    return new Promise<boolean>(async (resolve, reject) => {
        try{
            const response = await customClient.fetch(`/calls/${id}/state`, 'PUT' , {state : state})
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
