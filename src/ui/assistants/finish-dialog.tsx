import { Button } from "@/components/ui/button"
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";


export function FinishDialog({onDialogClose} : {onDialogClose:(action:string)=>void}) {
    return (
        <AlertDialog defaultOpen={true} onOpenChange={
            (e)=> {
                if (!e) onDialogClose("")
            }
        }>
            <AlertDialogContent className="w-[1000px]">
                <AlertDialogHeader>
                    <AlertDialogTitle>Felicitation vous y etes presque 🥳🥳</AlertDialogTitle>
                    <AlertDialogDescription>
                        Valider la creation de votre assistant , vous serez facture a xxxx euro
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={()=>{onDialogClose("VALIDER")}}>
                        Creer
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
