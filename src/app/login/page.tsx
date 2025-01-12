'use client'
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useRouter } from 'next/navigation'
import {LoginForm} from "@/ui/login-form";

export default function Page() {

    const router = useRouter()

    const onCloseModal = (state: boolean) => {
        if (!state) router.back()
    }
    return (
        <div className="w-full h-dvh flex flex-col justify-center items-center ">
            <Card className="w-[600px] border-primary border-2">
                <CardHeader>
                    <CardTitle>Medi virtual Assistant</CardTitle>
                    <CardDescription>
                        Connectez vous
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <LoginForm onSignin={function (data: any): void {
                    } } />
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline">Cancel</Button>
                </CardFooter>
            </Card>
        </div>
    )
}

