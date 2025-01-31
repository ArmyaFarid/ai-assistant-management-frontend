import {FormProps} from "@/ui/props";
import {AssistantConfigForm} from "@/ui/assistants/assistant-config-form";
import {useEffect, useRef, useState} from "react";
import {useHttpGet, useHttpPost, useHttpPut} from "@/lib/services/api/hooks/httpHooks";
import {Assistant, Phone, Resource} from "@/lib/definitions";
import {Button} from "@/components/ui/button";
import {NumberConfigForm} from "@/ui/numbers/number-config-form";
import {toast} from "@/components/ui/use-toast";
import {ResourceConfigForm} from "@/ui/resources/resource-config-form";

export const ManageResource : React.FC<{id : number}> = ({id})=>{

    const { data : resource , loading , refetch  } = useHttpGet<Resource>(`/resources/${id}`)

    const [updateResource, { response, loading: loadingPut  }] = useHttpPut('/resources');


    const activeFormRef = useRef<HTMLFormElement>(null);


    const [resourceFormData, setResourceFormData] = useState({
        id: id,
        name: resource?.name || "",
        content: resource?.content || "",
        description: resource?.description || "",
    });

    useEffect(() => {
        setResourceFormData(
            {
                id: id,
                name: resource?.name || "",
                content: resource?.content || "",
                description: resource?.description || "",
            }
        )
        console.log(resource)
    }, [id , resource]);

    useEffect(() => {
        refetch(`/resources/${id}`)
    }, [id]);


    const triggerActiveFormSubmit = () => {
        if(activeFormRef && activeFormRef.current){
            activeFormRef.current?.requestSubmit();
        }
    };

    function submit() {
        triggerActiveFormSubmit();
    }

    function handlePhoneUpdate(form : any) {
        console.log(form);
        updateResource(String(id),form).then(response=>{
            if(response.status == 200){
                toast({
                    title: "Enregistré",
                    description: `Les modifications ont ete sauvegardé`,
                })
            }
        }).finally(()=>{
            refetch();
        })
    }

    function reset() {
        refetch();
    }
    return (
        <>
            <div className="w-full flex justify-between items-center">

                <div className="flex flex-col">
                    <div className="text-xl text-primary font-bold">
                        {resourceFormData.name}
                    </div>
                    <div className="text-gray-500 flex gap-4 items-center">
                        {/*<p className="font-medium">Diriger vers l'assistant</p>*/}
                        {/*<div className="flex items-center gap-2">*/}
                        {/*    <span className="text-gray-700 font-semibold">{resource?.assistant?.assistantName}</span>*/}
                        {/*    <span className="text-gray-500">/</span>*/}
                        {/*    <span className="text-gray-600">{resourceFormData.assistantSid}</span>*/}
                        {/*</div>*/}
                    </div>

                </div>

                <div className="">
                    <Button>
                        Tester
                    </Button>
                </div>
            </div>

            <div className="w-full flex justify-end gap-8">
                <Button onClick={() => {submit()}}>
                    Enregistrer
                </Button>
                <Button variant="outline" onClick={()=>reset()}>
                    Annuler les changements
                </Button>
            </div>

            <div className="w-full flex flex-col">
                <ResourceConfigForm
                    onFormSubmit={async (ok, data) => {
                        setResourceFormData(prevState => ({
                            ...prevState,
                            name: data.name,
                            content: data.content,
                            description: data.description,
                            ...data,
                        }));
                        handlePhoneUpdate(
                            {
                                name: data.name,
                                content: data.content,
                                description: data.description,
                                ...data,
                                id : resource?.id,
                            }
                        )
                    }}
                    defaultData={resourceFormData}
                    formRef={activeFormRef}
                />

            </div>
        </>
    )
}
