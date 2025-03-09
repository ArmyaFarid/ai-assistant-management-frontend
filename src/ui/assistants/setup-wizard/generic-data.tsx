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
    structureName: z.string().min(2, {
        message: "2 lettres minimum.",
    }),
    availability : z.string().min(2, {
        message: "2 lettres minimum.",
    }),
    staff : z.string().min(2, {
        message: "2 lettres minimum.",
    }),
})


type FormDataType = {
    structureName: string
    staff : string
    availability : string
}

type FieldName = "availability" | "structureName" | "staff";

const formFieldList: FieldElement<FieldName>[] = [
    {
        fieldName: "structureName",
        label: "Nom de la structure",
        placeholder: "Clinique port l'argentoeil",
        inputType: "text",
        required: true,
    },
    {
        fieldName: "availability",
        label: "Decrivez vos jours et heures d'ouvertures",
        placeholder: "Ex : Lundi : 8h00 - 12h , 14h-17h ",
        inputType: "textarea",
        required: true,
    },
    {
        fieldName: "staff",
        label: "Écrire la liste de votre personnel",
        placeholder: "Ex : 1- Dr Donatien Paul (Kinésithérapeute, Spécialiste en rééducation fonctionnelle)",
        inputType: "textarea",
        required: true
    }

];



export const GenericData : React.FC<FormProps<FormDataType>> = ({onFormSubmit, defaultData, formRef , showSubmit }) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            structureName : defaultData.structureName,
            availability : defaultData.availability,
            staff : defaultData.staff,
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const data = {
            structureName : values.structureName ,
            staff : values.staff ,
            availability : values.availability ,
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
