import {FormProps} from "@/ui/props";
import {AssistantConfigForm} from "@/ui/assistants/assistant-config-form";
import {useEffect, useRef, useState} from "react";
import {useHttpGet, useHttpPost, useHttpPut} from "@/lib/services/api/hooks/httpHooks";
import {Assistant, Phone} from "@/lib/definitions";
import {Button} from "@/components/ui/button";
import {NumberConfigForm} from "@/ui/numbers/number-config-form";
import {toast} from "@/components/ui/use-toast";

export const ManageNumber : React.FC<{number : string}> = ({number})=>{

    const { data : phone , loading , refetch  } = useHttpGet<Phone>(`/phones/number/${number}`)

    const [updateNumber, { response, loading:loadingPut  }] = useHttpPut('/phones');


    const activeFormRef = useRef<HTMLFormElement>(null);


    const [numberFormData, setNumberFormData] = useState({
        number: number,
        description: phone?.description,
        assistantSid: "",
    });

    useEffect(() => {
        setNumberFormData(
            {
                number: number,
                description: phone?.description || "",
                assistantSid: phone?.assistant?.assistantSid || "",
            }
        )
        console.log(phone)
    }, [number , phone]);

    useEffect(() => {
        refetch(`/phones/number/${number}`)
    }, [number]);


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
        updateNumber(number,form).then(response=>{
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
                        {numberFormData.number}
                    </div>
                    <div className="text-gray-500 flex gap-4 items-center">
                        <p className="font-medium">Diriger vers l'assistant</p>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-700 font-semibold">{phone?.assistant?.assistantName}</span>
                            <span className="text-gray-500">/</span>
                            <span className="text-gray-600">{numberFormData.assistantSid}</span>
                        </div>
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
                <NumberConfigForm
                    onFormSubmit={async (ok, data) => {
                        setNumberFormData(prevState => ({
                            ...prevState,
                            assistantSid: data.assistantSid,
                            description: data.description,
                            ...data,
                        }));
                        handlePhoneUpdate(
                            {
                                assistantSid: data.assistantSid,
                                description: data.description,
                                ...data,
                                number : phone?.number,
                            }
                        )
                    }}
                    defaultData={numberFormData}
                    formRef={activeFormRef}
                />

            </div>
        </>
    )
}
