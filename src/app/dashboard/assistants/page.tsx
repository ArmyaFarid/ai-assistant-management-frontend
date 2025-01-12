'use client';
import {Button} from "@/components/ui/button";
import {AssistantConfigForm} from "@/ui/assistants/assistant-config-form";
import {useEffect, useRef, useState} from "react";
import {useHttpGet, useHttpPost} from "@/lib/services/api/hooks/httpHooks";
import {Assistant, User} from "@/lib/definitions";
import {ManageAssistant} from "@/app/dashboard/assistants/manage-assistant";
import {cn} from "@/lib/utils";
import {toast} from "@/components/ui/use-toast";


export default function Page() {


    const [createAssistant, { response, isCreatingAssistant  }] = useHttpPost<Assistant>('/assistants');

    const { data : assistants , loading , refetch  } = useHttpGet<Assistant[]>('/assistants')


    const [activeAssistant, setActiveAssistant] = useState<string|null>(null);


    useEffect(() => {
        if(assistants && assistants?.length > 0) setActiveAssistant(assistants[0].assistantSid);
    }, [assistants]);

    function handleAssistantCreate() {
        const form = {
            assistantName: "Nouveau assistant",
            prompt: "",
            welcomeMessage: ""
        };
        createAssistant(form).then(response=>{
            if(response.status == 200){
                toast({
                    title: "Reussi",
                    description: `L'assistant a été cree`,
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
                                        handleAssistantCreate();
                                    }}

                                    disabled={isCreatingAssistant}
                                >
                                    Créer un nouveau assistant
                                </Button>
                            </div>

                            {/* Assistant List Section */}
                            <ul className="flex flex-col gap-4 h-[550px]  overflow-auto scroll-auto scrollbar-hide">
                                {
                                    assistants && assistants.map((assistant) => {
                                        return (
                                            <li key={assistant.assistantSid}
                                                // className="p-4 cursor-pointer rounded-lg transition-all hover:bg-gray-200"
                                                className={
                                                    cn(
                                                        "p-4 cursor-pointer rounded-lg transition-all hover:bg-gray-200",
                                                        activeAssistant == assistant.assistantSid && "bg-gray-200"
                                                    )
                                                }
                                                onClick={()=>{
                                                    setActiveAssistant(assistant.assistantSid)
                                                }}
                                            >
                                                <div className="flex justify-between items-center text-gray-800">
                                                    <span className="font-medium text-sm">{assistant.assistantSid}</span>
                                                    <span className="text-gray-500 text-xs">{assistant.assistantName}</span>
                                                </div>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>

                        <div className="flex-1 w-full flex flex-col gap-8 p-8">
                            {activeAssistant && <ManageAssistant assistantSid={activeAssistant}/>}
                        </div>

                    </div>
                </div>
    )
}
