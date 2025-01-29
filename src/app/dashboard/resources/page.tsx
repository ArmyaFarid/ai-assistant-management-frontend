'use client';
import {Button} from "@/components/ui/button";
import {AssistantConfigForm} from "@/ui/assistants/assistant-config-form";
import {useEffect, useRef, useState} from "react";
import {NumberConfigForm} from "@/ui/numbers/number-config-form";
import {ManageResource} from "@/app/dashboard/resources/manage-resource";
import {useHttpGet, useHttpPost} from "@/lib/services/api/hooks/httpHooks";
import {Assistant, Phone, Resource} from "@/lib/definitions";
import {cn} from "@/lib/utils";
import {toast} from "@/components/ui/use-toast";


export default function Page() {
    // const numbers = [
    //     {
    //         sid: "as_ye67",
    //         number: "+335677888"
    //     },
    // ];

    const [createResource, { response, isCreatingResource  }] = useHttpPost<Phone>('/resources');

    const { data : resources , loading , refetch  } = useHttpGet<Resource[]>('/resources')


    const [activeResource, setActiveResource] = useState<number|null>(null);


    useEffect(() => {
        if(resources && resources.length > 0) setActiveResource(resources[0].id);
    }, [resources]);

    function handlePhoneCreate() {
        const form = {
            name : "Ressource n 1",
        };
        createResource(form).then(response=>{
            if(response.status == 200){
                toast({
                    title: "Reussi",
                    description: `La ressource est cree`,
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
                                        disabled={isCreatingResource}
                                >
                                    Creer une ressource
                                </Button>
                            </div>

                            {/* Assistant List Section */}
                            <ul className="flex flex-col gap-4 h-[550px]  overflow-auto scroll-auto scrollbar-hide">
                                {
                                    resources && resources.map((resource) => {
                                        return (
                                            <li key={resource.id}
                                                className={
                                                    cn(
                                                        "p-4 cursor-pointer rounded-lg transition-all hover:bg-gray-200",
                                                        activeResource == resource.id && "bg-gray-200"
                                                    )
                                                }
                                                onClick={()=>{
                                                    setActiveResource(resource.id)
                                                }}
                                            >
                                                <div className="flex justify-between items-center text-gray-800">
                                                    <span className="font-medium text-sm">{resource.name}</span>
                                                    {/*<span className="text-gray-500 text-xs">{resource?.assistant?.assistantSid}</span>*/}
                                                </div>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>

                        <div className="flex-1 w-full flex flex-col gap-8 p-8">

                            {activeResource && <ManageResource id={activeResource}/>}

                        </div>

                    </div>
                </div>
    )
}
