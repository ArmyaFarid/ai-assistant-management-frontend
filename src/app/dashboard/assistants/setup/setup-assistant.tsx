"use client";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {StepIndicator} from "@/ui/step-indicator";
import {forwardRef, useEffect, useRef, useState} from "react";
import {useRouter} from "next/navigation";
import {useHttpPost} from "@/lib/services/api/hooks/httpHooks";
import {FinishDialog} from "@/ui/assistants/finish-dialog";
import {AssistantMode} from "@/ui/assistants/setup-wizard/assistant-mode";
import {GenericData} from "@/ui/assistants/setup-wizard/generic-data";
import {AssistantInfo} from "@/ui/assistants/setup-wizard/assistant-info";

export default function SetupAssistant({onSuccess } : {onSuccess:()=>void}) {
    const numbersOfStep = 4;
    const router = useRouter()
    const activeFormRef = useRef<HTMLFormElement>(null);
    const [activeStep, setActiveStep] = useState<number>(0);
    const [finish, setFinish] = useState<boolean>(false);
    const [started, setStarted] = useState<boolean>(false);
    const [formData , setFormData] = useState<any>({});
    const [setUpAssistant,{loading,error , response}] = useHttpPost('/assistants/setup');


    useEffect(() => {
        try {
            const savedFormData = localStorage.getItem('offerFormData');
            const initialFormData = savedFormData ? JSON.parse(savedFormData) : {};
            setFormData(initialFormData);
            setActiveStep(1);
        }catch (e) {
            console.log(e)
        }
        setActiveStep(1);

    }, []);


    const formTitles : string[] = [
        "Choix de l'assistant" ,
        "Configuration de votre assistant" ,
        "Information generale sur votre clinique" ,
        "Associer un numero de telephone" ,
    ];

    useEffect(() => {
        if(started){
            localStorage.setItem('offerFormData', JSON.stringify(formData));
        }
    }, [formData]);


    function next() {
        setActiveStep(prev => {
            if (prev + 1 <= numbersOfStep) {
                return prev + 1
            }
            return prev
        })
        if (activeStep === numbersOfStep) {
            // router.push('/employers/app')
        }
        // saveFormDataToLocalStorage();
    }

    function submit() {
        triggerActiveFormSubmit();
    }

    function prev() {
        setActiveStep(prev => {
            if (prev > 1) {
                return prev - 1
            }
            return prev
        })
    }


    const triggerActiveFormSubmit = () => {
        if(activeFormRef && activeFormRef.current){
            activeFormRef.current?.requestSubmit();
        }
    };


    async function handleAssistantSetup(status: string) {
        const data = {
            ...formData,
            status: status
        }

        const jsonBody = {
            ...data
        };

        const r = await setUpAssistant(jsonBody);
        return r;
    }

    const getActiveForm = ({step , defaultForm }: { step : number , defaultForm : any } ): React.ReactElement | null => {
        switch (step) {
            case 1:
                return (
                    <AssistantMode
                        onFormSubmit={async (ok, data) => {
                            setStarted(true);
                            setFormData((prevState : any) => ({
                                ...prevState,
                                ...data,
                            }));
                            next();
                        }}
                        defaultData={defaultForm}
                        formRef={activeFormRef}
                    />
                );
            case 2:
                return (
                    <AssistantInfo
                        onFormSubmit={async (ok, data) => {
                            setFormData((prevState : any)  => ({
                                ...prevState,
                                ...data,
                            }));
                            next();
                        }}
                        defaultData={defaultForm}
                        formRef={activeFormRef}
                    />
                );
            case 3:
                return (
                    <GenericData
                        onFormSubmit={async (ok, data) => {
                            setFormData((prevState : any)  => ({
                                ...prevState,
                                ...data,
                            }));
                            next();
                        }}
                        defaultData={defaultForm}
                        formRef={activeFormRef}
                    />
                );
            case 4:
                return (
                   <form ref={activeFormRef} onSubmit={(event)=>{
                       event.preventDefault()
                       console.log(defaultForm)
                       setFinish(true);
                   }}>
                       Configurer un numero de telephone
                   </form>
                );
            default:
                return <>no form</>;
        }
    };

    return (
        <div className="w-full flex flex-col justify-center items-center overflow-auto gap-8">
            {
                finish && <FinishDialog onDialogClose={(action)=>{
                    if(action != ""){
                        handleAssistantSetup(action).then((r)=>{
                            console.log(r)
                            if(r.ok && r.status == 201){
                                onSuccess();
                            }
                        });
                    }
                    setFinish(false);
                }}/>
            }
            <StepIndicator numbersOfStep={numbersOfStep} activeIndex={activeStep}/>
            <Card className="w-[600px] border-primary border-0">
                <CardHeader className="text-center">
                    <CardTitle>{formTitles[activeStep - 1]}</CardTitle>
                </CardHeader>
                <CardContent>
                    {
                        getActiveForm({step : activeStep, defaultForm: formData})
                    }
                </CardContent>
                <CardFooter className="flex justify-between">
                    <div className="flex flex-row gap-2 w-[600px]">
                        {
                            activeStep > 1 &&
                            <Button
                                className="grow"
                                variant="outline"
                                onClick={() => {
                                    prev()
                                }}
                            >
                                Precedant
                            </Button>

                        }

                        <Button
                            className="grow"
                            onClick={() => {
                                submit()
                            }}
                        >
                            {
                                activeStep < numbersOfStep ? "Suivant" : "Terminer"
                            }
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
