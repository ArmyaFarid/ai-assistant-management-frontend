"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { toast } from "@/components/ui/use-toast"

type OtpFormProps = {
  onSignin: (data: any) => void;
}

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
})

export function OTPForm({ onSignin }: OtpFormProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data)
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
    onSignin(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 text-[32px] flex flex-col justify-center items-center">
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel>Code otp</FormLabel> */}
              <FormControl>
                <InputOTP maxLength={6} {...field} className="text-[32px]">
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="h-[80px] w-[70px]" />
                    <InputOTPSlot index={1} className="h-[80px] w-[70px]" />
                    <InputOTPSlot index={2} className="h-[80px] w-[70px]" />
                    <InputOTPSlot index={3} className="h-[80px] w-[70px]" />
                    <InputOTPSlot index={4} className="h-[80px] w-[70px]" />
                    <InputOTPSlot index={5} className="h-[80px] w-[70px]" />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              {/* <FormDescription>
                Entrez votre code que vous avez recu.
              </FormDescription> */}
              <FormMessage className="text-[12px]" />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full mt-8 h-[50px]">Submit</Button>
      </form>
    </Form>
  )
}
