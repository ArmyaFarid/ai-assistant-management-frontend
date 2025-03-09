"use client";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {Button} from "@/components/ui/button";
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form";
import {Fragment, useEffect, useState} from "react";
import {FormProps} from "@/ui/props";
import {
    getAssistantModes
} from "@/lib/services/data-options";
import {cn} from "@/lib/utils";
import {FieldElement} from "@/ui/type";
import RequiredTag from "@/ui/required-tag";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";


const formSchema = z.object({
    assistantName: z.string().min(2, {
        message: "2 lettres minimum.",
    }),
    welcomeMessage : z.string().min(2, {
        message: "2 lettres minimum.",
    }),
})


type FormDataType = {
    welcomeMessage: string
    assistantName : string
}

type FieldName = "welcomeMessage" | "assistantName";

const formFieldList: FieldElement<FieldName>[] = [
    {
        fieldName: "assistantName",
        label: "Nommer votre assistant",
        placeholder: "Clinique port l'argentoeil",
        inputType: "text",
        required: true,
    },
    {
        fieldName: "welcomeMessage",
        label: "Ecrire le message bienvenue a dire par votre assistant",
        placeholder: "Ex : Bonjour et bienvenue à la Clinique Santé Plus !",
        inputType: "textarea",
        required: true
    }

];



export const AssistantInfo : React.FC<FormProps<FormDataType>> = ({onFormSubmit, defaultData, formRef , showSubmit }) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            assistantName : defaultData.assistantName,
            welcomeMessage : defaultData.welcomeMessage,
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const data = {
            welcomeMessage : values.welcomeMessage ,
            assistantName : values.assistantName ,
        }
        onFormSubmit(true , data);
    }

    useEffect(() => {
        setOptionData();
    }, []);

    async function setOptionData() {

    }


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
                {
                    showSubmit &&
                    <Button type="submit" className="w-full mt-8 h-[50px]">Submit</Button>
                }
            </form>
        </Form>
    )
}
