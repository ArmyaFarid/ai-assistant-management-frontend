"use client";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {Button} from "@/components/ui/button";
import {
    Form
} from "@/components/ui/form";
import {useEffect, useState} from "react";
import {FormProps} from "@/ui/props";
import {
    getAssistantModes
} from "@/lib/services/data-options";
import {cn} from "@/lib/utils";


const formSchema = z.object({
    mode: z.number(),
})


type FormDataType = {
    mode : number
}

type FieldName = | "mode";




export const AssistantMode : React.FC<FormProps<FormDataType>> = ({onFormSubmit, defaultData, formRef , showSubmit }) => {

    const [assistantModeOptions, setAssistantModeOptions] = useState<string[] | null>(null);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            mode : defaultData.mode,
        },
    })
    const [selectedMode, setSelectedMode] = useState(1);

    const modes = [
        { id: 1, label: "Général", description: "Mode polyvalent pour fournir des informations et effectuer des réservations" },
        { id: 2, label: "Orthopédique & Kinésithérapie", description: "Mode pour la rééducation et les soins des troubles musculo-squelettiques" },
        { id: 3, label: "Dentaire", description: "Mode pour la prise de rendez-vous, informations et conseils sur les soins dentaires" },
        { id: 4, label: "Pédiatrique", description: "Mode pour la prise en charge des rendez-vous, informations et conseils pour les soins des enfants" },
    ];




    async function onSubmit(values: z.infer<typeof formSchema>) {
        const data = {
            mode : values.mode ,
        }
        onFormSubmit(true , data);
    }

    useEffect(() => {
        if(defaultData.mode){
            setSelectedMode(defaultData.mode);
        }
        setOptionData();
    }, []);

    async function setOptionData() {
        const assistantMode = await getAssistantModes();
        setAssistantModeOptions(assistantMode);
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 text-base" ref={formRef}>

                <div>
                    <div className="grid grid-cols-2 gap-4">
                        {modes.map((mode) => (
                            <label
                                key={mode.id}
                                className={cn(
                                    "cursor-pointer p-4 border-2 rounded-xl text-center transition-all",
                                    selectedMode == mode.id
                                        ? "border-blue-500 bg-blue-100"
                                        : "border-gray-300 hover:border-blue-400"
                                )}>
                                <input
                                    type="radio"
                                    name="assistantMode"
                                    value={mode.id}
                                    className="hidden"
                                    checked={selectedMode === mode.id}
                                    onChange={() => {
                                        form.setValue("mode",mode.id)
                                        setSelectedMode(mode.id)
                                    }}
                                />
                                <div className="text-lg font-medium">{mode.label}</div>
                                <div className="text-sm text-gray-600">{mode.description}</div>
                            </label>
                        ))}
                    </div>
                </div>
                {
                    showSubmit &&
                    <Button type="submit" className="w-full mt-8 h-[50px]">Submit</Button>
                }
            </form>
        </Form>
    )
}
