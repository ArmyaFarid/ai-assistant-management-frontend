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
import {useHttpGet} from "@/lib/services/api/hooks/httpHooks";
import {Assistant} from "@/lib/definitions";

const formSchema = z.object({
    description: z.string().min(2, {
        message: "2 lettres minimum.",
    }),
    assistantSid: z.string().min(2, {
        message: "2 lettres minimum.",
    }),
})


type BasicsInfoType = {
    number:string
    description: string| undefined
    assistantSid: string
}

type FieldName = "description" | "assistantSid";



const formFieldList: FieldElement<FieldName>[] = [
    {
        fieldName: "description",
        label: "Descriptioon",
        placeholder: "Ex : Pour les reservations..",
        inputType: "text",
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



export const NumberConfigForm : React.FC<FormProps<BasicsInfoType>> = ({onFormSubmit, defaultData, formRef , showSubmit }) => {

    const { data : assistants , loading , refetch  } = useHttpGet<Assistant[]>('/assistants')

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description:  defaultData.description,
            assistantSid: defaultData.assistantSid,
        },
    })


    async function onSubmit(values: z.infer<typeof formSchema>) {

        const data = {
            description: values.description,
            assistantSid: values.assistantSid,
        }
        console.log(data)
        onFormSubmit(true , data);
    }


    useEffect(() => {
        // Check if defaultData has changed
        if (defaultData) {
            form.reset({
                description: defaultData.description,
                assistantSid: defaultData.assistantSid,
            });
        }
    }, [defaultData, form]);

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
                    name="assistantSid"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Choisir l'assistant qui va repondre<RequiredTag/></FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choisir un assistant" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {
                                        assistants &&
                                        assistants.map((option)=>{
                                            return (
                                                <SelectItem key={option.assistantSid} value={option.assistantSid}>{option.assistantName}</SelectItem>
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
