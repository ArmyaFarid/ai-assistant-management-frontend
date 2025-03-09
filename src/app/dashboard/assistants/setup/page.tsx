'use client';
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {boolean} from "zod";
import {useHttpGet} from "@/lib/services/api/hooks/httpHooks";
import SetupAssistant from "@/app/dashboard/assistants/setup/setup-assistant";

export default function Page() {
    const router = useRouter()
    const [shouldBack , setShouldBack ] = useState<boolean>(true)

    const onCloseModal = (state:boolean)=>{
        setOpen(state)

        if(!state && shouldBack) router.back()
    }
    const [open, setOpen] = useState(true);



    return (
        <Dialog defaultOpen={true} open={open} onOpenChange={onCloseModal}>
            <DialogContent className="min-w-[80vw] sm:max-w-[500px] text-base max-h-[90vh] overflow-y-auto items-center">
                <DialogHeader>
                    <DialogTitle className='text-base'> Configuration de votre assistant </DialogTitle>
                    <DialogDescription className='text-base'>
                        Configurer l'assistant pour votre clinique
                    </DialogDescription>
                </DialogHeader>
                <SetupAssistant onSuccess={()=>{
                    setOpen(false)
                    router.replace('/dashboard/assistants')
                }
                }/>
            </DialogContent>
        </Dialog>
    )
}
