'use client'
import { useRouter } from 'next/navigation'
import DemoVoiceAssistant from "@/app/demo/ai/demo-voice-assistant";

export default function Page() {

    const router = useRouter()

    const onCloseModal = (state: boolean) => {
        if (!state) router.back()
    }
    return (
        <div className="w-full h-dvh flex flex-col justify-center items-center ">
                    <DemoVoiceAssistant/>
        </div>
    )
}

