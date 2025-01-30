import {FormProps} from "@/ui/props";
import {AssistantConfigForm} from "@/ui/assistants/assistant-config-form";
import {useEffect, useRef, useState} from "react";
import {useHttpGet, useHttpPost, useHttpPut} from "@/lib/services/api/hooks/httpHooks";
import {Assistant} from "@/lib/definitions";
import {Button} from "@/components/ui/button";
import {toast} from "@/components/ui/use-toast";
import DemoVoiceAssistant from "@/app/demo/ai/demo-voice-assistant";

export const ManageAssistant : React.FC<{assistantSid : string}> = ({assistantSid})=>{

    const { data : assistant , loading , refetch  } = useHttpGet<Assistant>(`/assistants/sid/${assistantSid}`)

    const [updateAssistant, { response, loadingPut  }] = useHttpPut<Assistant>('/assistants');


    const activeFormRef = useRef<HTMLFormElement>(null);

    const [assistantFormData, setAssistantFormData] = useState({
        assistantSid: assistantSid,
        assistantName: "",
        welcomeMessage: "",
        prompt: "",
        resources : [],
        option: "",
    });

    useEffect(() => {
        setAssistantFormData(
            {
                assistantSid: assistantSid,
                assistantName: assistant?.assistantName || "",
                welcomeMessage: assistant?.welcomeMessage || "",
                prompt: assistant?.prompt?.id.toString() || "",
                resources : assistant?.resources.map((r)=>{return r.id}) || [],
                option: "",
            }
        )
    }, [assistantSid , assistant]);

    useEffect(() => {
        refetch(`/assistants/sid/${assistantSid}`)
    }, [assistantSid]);


    const triggerActiveFormSubmit = () => {
        if(activeFormRef && activeFormRef.current){
            activeFormRef.current?.requestSubmit();
        }
    };

    function submit() {
        triggerActiveFormSubmit();
    }

    function handleAssistantUpdate(form : any) {
        updateAssistant(assistantSid,form).then(response=>{
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
            <div className="w-full flex justify-between">

                <div className="flex flex-col">
                    <div className="text-xl text-primary font-bold">
                        {assistantFormData.assistantName}
                    </div>
                    <div className="text-gray-500">
                        {assistantFormData.assistantSid}
                    </div>
                </div>

                <div className="">
                    {/*<Button>*/}
                    {/*    Tester*/}
                    {/*</Button>*/}
                    {
                        assistantFormData &&
                        <DemoVoiceAssistant assistantSid={assistantFormData.assistantSid} startMessage={assistantFormData.welcomeMessage}/>
                    }
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
                <AssistantConfigForm
                    onFormSubmit={async (ok, data) => {
                        setAssistantFormData(prevState => ({
                            ...prevState,
                            assistantName: data.assistantName,
                            welcomeMessage: data.welcomeMessage,
                            ...data,
                            assistantSid: assistant?.assistantSid,
                        }));

                        handleAssistantUpdate({
                            assistantName: data.assistantName,
                            welcomeMessage: data.welcomeMessage,
                            ...data,
                            assistantSid: assistant?.assistantSid,
                        });
                    }}
                    defaultData={assistantFormData}
                    formRef={activeFormRef}
                />

            </div>
        </>
    )
}
