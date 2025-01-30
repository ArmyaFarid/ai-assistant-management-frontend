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
import {Textarea} from "@/components/ui/textarea";

const formSchema = z.object({
    name: z.string().min(2, {
        message: "2 lettres minimum.",
    }),
    description: z.string().min(2, {
        message: "2 lettres minimum.",
    }),
    content: z.string().min(10, {
        message: "10 lettres minimum.",
    }),
})


type BasicsInfoType = {
    name: string
    description: string
    content: string
}

type FieldName = "name" | "content" | "description";



const formFieldList: FieldElement<FieldName>[] = [
    {
        fieldName: "name",
        label: "Nom de la ressource",
        placeholder: "Ex : Liste des medecins 2024",
        inputType: "text",
        required: true,
    },
    {
        fieldName: "content",
        label: "Contenu",
        placeholder: "Ex : 1-Mohamed Chabi (pediatres).",
        inputType: "textarea",
        required: true,
    },
    {
        fieldName: "description",
        label: "Description",
        placeholder: "Ex : Ceci est la liste de nos medecins pour 2024",
        inputType: "text",
        required: true,
    },
];



export const ResourceConfigForm : React.FC<FormProps<BasicsInfoType>> = ({onFormSubmit, defaultData, formRef , showSubmit }) => {

    const [list , setList] = useState<string[]|null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: defaultData.name,
            description: defaultData.description,
            content: defaultData.content,
        },
    })


    useEffect(() => {
        // Check if defaultData has changed
        if (defaultData) {
            form.reset({
                name: defaultData.name,
                description: defaultData.description,
                content: defaultData.content,
            });
        }
    }, [defaultData, form]);


    async function onSubmit(values: z.infer<typeof formSchema>) {

        const data = {
            name: values.name,
            description: values.description,
            content: values.content,
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


                {
                    showSubmit &&
                    <Button type="submit" className="w-full mt-8 h-[50px]">Submit</Button>
                }
            </form>
        </Form>
    )
}
