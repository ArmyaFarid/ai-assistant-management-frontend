"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"

import {Button} from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {Fragment, useEffect, useRef, useState} from "react"
import {FormProps} from "@/ui/props";
import {FieldElement} from "@/ui/type";
import RequiredTag from "@/ui/required-tag";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";

const formSchema = z.object({
    assistantName: z.string().min(2, {
        message: "2 lettres minimum.",
    }),
    welcomeMessage: z.string().min(2, {
        message: "2 lettres minimum.",
    }),
    prompt: z.string().min(10, {
        message: "10 lettres minimum.",
    }),
    option: z.string().min(0, {
        message: "2 lettres minimum.",
    }).optional(),
})


type BasicsInfoType = {
    assistantName: string
    welcomeMessage: string
    prompt: string
    option: string
}

type FieldName = "assistantName" | "prompt" | "welcomeMessage" | "option";



const formFieldList: FieldElement<FieldName>[] = [
    {
        fieldName: "assistantName",
        label: "Nom de l'assistant",
        placeholder: "Cortana",
        inputType: "text",
        required: true,
    },
    {
        fieldName: "welcomeMessage",
        label: "Message d'acceuil",
        placeholder: "Ex : Bonjour , bienvenue a la clinique sante pour tous...",
        inputType: "text",
        required: true,
    },
    {
        fieldName: "prompt",
        label: "Instructions systeme",
        placeholder: "Ex : Tu es une assistante telephonique qui aide a prendre les rendez vous.",
        inputType: "textarea",
        required: true,
    },
    // {
    //     fieldName: "option",
    //     label: "Secteur d'activité",
    //     placeholder: "Ex : Informatique, Santé, Éducation",
    //     inputType: "text",
    //     required: true,
    // },
];



export const AssistantConfigForm : React.FC<FormProps<BasicsInfoType>> = ({onFormSubmit, defaultData, formRef , showSubmit }) => {

    const [list , setList] = useState<string[]|null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            assistantName: defaultData.assistantName,
            welcomeMessage: defaultData.welcomeMessage,
            prompt: defaultData.prompt,
            option: defaultData.option,
        },
    })


    useEffect(() => {
        // Check if defaultData has changed
        if (defaultData) {
            form.reset({
                assistantName: defaultData.assistantName,
                welcomeMessage: defaultData.welcomeMessage,
                prompt: defaultData.prompt,
                option: defaultData.option,
            });
        }
    }, [defaultData, form]);


    async function onSubmit(values: z.infer<typeof formSchema>) {

        const data = {
            assistantName: values.assistantName,
            welcomeMessage: values.welcomeMessage,
            prompt: values.prompt,
            option: values.option,
        }
        onFormSubmit(true , data);
    }

    useEffect(() => {
        setList(["Homme","Femme"]);
    }, []);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 text-base" ref={formRef}>
                {
                    formFieldList.map((fieldElement)=>{
                        return (
                            <Fragment key={fieldElement.fieldName}>
                                <FormField
                                    control={form.control}
                                    name={fieldElement.fieldName}
                                    render={({field}) => {
                                        return (
                                            <FormItem
                                                key={fieldElement.fieldName}
                                            >
                                                <FormLabel>
                                                    {fieldElement.label}
                                                    {fieldElement?.required && <RequiredTag/>}
                                                </FormLabel>
                                                <FormControl>
                                                    {
                                                        fieldElement.inputType !== "textarea" ?
                                                            <Input placeholder={fieldElement.placeholder ?? fieldElement.label} {...field} type={fieldElement.inputType}/>
                                                            :
                                                            <Textarea placeholder={fieldElement.placeholder ?? fieldElement.label} {...field} />
                                                    }
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )

                                    }}
                                />
                            </Fragment>
                        )
                    })
                }

                <FormField
                    control={form.control}
                    name="option"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Voix<RequiredTag/></FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choisir une option" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {
                                        list &&
                                        list.map((option)=>{
                                            return (
                                                <SelectItem key={option} value={option}>{option}</SelectItem>
                                            )
                                        })
                                    }
                                </SelectContent>
                            </Select>
                            {/*<FormControl>*/}
                            {/*    <Input placeholder="Ecrire son secteur" {...field}*/}
                            {/*           type="text"/>*/}
                            {/*</FormControl>*/}
                            <FormMessage className="text-[12px]" />
                        </FormItem>
                    )}
                />


                {
                    showSubmit &&
                    <Button type="submit" className="w-full mt-8 h-[50px]">Submit</Button>
                }
            </form>
        </Form>
    )
}
