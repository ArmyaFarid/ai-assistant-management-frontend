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
import {useRouter} from 'next/navigation'
import {useLogin} from "@/lib/services/api/hooks/authHooks";
import {User} from "@/lib/definitions";
import {useEffect} from "react";
import {getUrlForRole} from "@/lib/services/role.service";
import {UserRole} from "@/lib/roles";
import {useHttpPost} from "@/lib/services/api/hooks/httpHooks";

const formSchema = z.object({
    fullname: z.string().min(4, {
        message: "Au moins 4 caractere.",
    }),
    password: z.string().min(4, {
        message: "Au moins 4 caractere.",
    }),
    email: z.string().min(4, {
        message: "Saisir votre email.",
    }).email({message: "Invalid email address"}),
})


interface SigninFormProps {
    onSignin: (data: any) => void;
}


export function SignupForm({onSignin}: SigninFormProps) {
    const router = useRouter()
    const [postData, { response, loading  }] = useHttpPost('/auth/signup');
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullname: "",
            password: "",
            email: "",
        },
    })

    const redirectToOTP = ()=> {
        const nextUrl = '/employers/app';
        const url = new URL('/employers/login/otp', window.location.origin);
        url.searchParams.append('redirect', nextUrl);
        router.push(url.toString());
    }

    const  onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values)
        if (values.password && values.password) {
            const loginData = {
                fullName: values.fullname,
                email: values.email,
                password: values.password
            }
            const logRes = await postData(loginData);
            console.log(logRes)
            if(logRes){
                onSignin(logRes);
                router.replace(`/login`)
            }
        }

        // router.push(`/corporate/login/otp?nextUrl='/corporate/management'`);
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 text-base">
                <FormField
                    control={form.control}
                    name="fullname"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Votre nom complet</FormLabel>
                            <FormControl>
                                <Input className="h-[50px]" placeholder="Nom complet" {...field} type="text"/>
                            </FormControl>
                            {/* <FormDescription>
                Addresse professionel
              </FormDescription> */}
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Votre adresse mail</FormLabel>
                            <FormControl>
                                <Input className="h-[50px]" placeholder="Mail" {...field} type="email"/>
                            </FormControl>
                            {/* <FormDescription>
                Addresse professionel
              </FormDescription> */}
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Mot de passe</FormLabel>
                            <FormControl>
                                <Input className="h-[50px]" placeholder="Mot de passe" {...field} type="password"/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full mt-8 h-[50px]">Submit</Button>
            </form>
        </Form>
    )
}
