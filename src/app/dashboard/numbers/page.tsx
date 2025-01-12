'use client';
import {Button} from "@/components/ui/button";
import {AssistantConfigForm} from "@/ui/assistants/assistant-config-form";
import {useEffect, useRef, useState} from "react";
import {NumberConfigForm} from "@/ui/numbers/number-config-form";
import {ManageNumber} from "@/app/dashboard/numbers/manage-number";
import {useHttpGet, useHttpPost} from "@/lib/services/api/hooks/httpHooks";
import {Assistant, Phone} from "@/lib/definitions";
import {cn} from "@/lib/utils";
import {toast} from "@/components/ui/use-toast";


export default function Page() {
    // const numbers = [
    //     {
    //         sid: "as_ye67",
    //         number: "+335677888"
    //     },
    // ];

    const [createPhone, { response, isCreatingPhone  }] = useHttpPost<Phone>('/phones');

    const { data : phones , loading , refetch  } = useHttpGet<Phone[]>('/phones')


    const [activePhone, setActivePhone] = useState<string|null>(null);


    useEffect(() => {
        if(phones && phones.length > 0) setActivePhone(phones[0].number);
    }, [phones]);

    function handlePhoneCreate() {
        const form = {

        };
        createPhone(form).then(response=>{
            if(response.status == 200){
                console.log("workeeed")
                toast({
                    title: "Reussi",
                    description: `Un numero vous a ete attribue`,
                })
            }
        }).finally(()=>{
            refetch();
        })
    }





    return (
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <div className=" flex-1  md:min-h-min flex flex-col md:flex-row" >

                        <div className="flex flex-col p-6 rounded-2xl bg-muted/50 h-[600px] w-fit gap-6">
                            {/* Button Section */}
                            <div className="text-center">
                                <Button className="px-6 py-2 text-lg font-semibold text-white"
                                        onClick={()=>{
                                            handlePhoneCreate();
                                        }}
                                        disabled={isCreatingPhone}
                                >
                                    Acheter un numero
                                </Button>
                            </div>

                            {/* Assistant List Section */}
                            <ul className="flex flex-col gap-4 h-[550px]  overflow-auto scroll-auto scrollbar-hide">
                                {
                                    phones && phones.map((phone) => {
                                        return (
                                            <li key={phone.number}
                                                className={
                                                    cn(
                                                        "p-4 cursor-pointer rounded-lg transition-all hover:bg-gray-200",
                                                        activePhone == phone.number && "bg-gray-200"
                                                    )
                                                }
                                                onClick={()=>{
                                                    setActivePhone(phone.number)
                                                }}
                                            >
                                                <div className="flex justify-between items-center text-gray-800">
                                                    <span className="font-medium text-sm">{phone.number}</span>
                                                    <span className="text-gray-500 text-xs">{phone?.assistant?.assistantSid}</span>
                                                </div>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>

                        <div className="flex-1 w-full flex flex-col gap-8 p-8">

                            {activePhone && <ManageNumber number={activePhone}/>}

                        </div>

                    </div>
                </div>
    )
}
