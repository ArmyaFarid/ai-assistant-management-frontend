"use client"

import { ColumnDef } from "@tanstack/react-table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem, DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {MoreHorizontal} from "lucide-react";
import {MdOutlineMoreHoriz} from "react-icons/md";
import {Button} from "@/components/ui/button";
import {GoSortAsc} from "react-icons/go";
import {Checkbox} from "@/components/ui/checkbox";
import {DataTableColumnHeader} from "@/ui/table/data-table-collumn-header";
import {Call} from "@/lib/definitions";
import CopyToClipboard from "@/ui/copy-to-clipboard";
import {formatDateToLocal} from "@/lib/utils";
import {changeCallState} from "@/lib/services/call.service";


type GetColumnsProps = {
    setDeleteModalComponent:(component: any) => void;
    reLoadData:()=>void;
}


const getPlainTextCallReason = (reason : string)=>{
    switch (reason) {
        case 'book_appointment':
            return "Prise de rendez vous"
        case  'cancel_appointment':
            return  "Anullation de rendez vous"
        default:
            return reason
    }

}

const getPlainTextCallState = (state : string)=>{
    switch (state) {
        case 'NEW':
            return "En attente de traitement"
        case  'REVIEWED':
            return  "Deja Traité"
        default:
            return state
    }
}

const getStatusColorTag = (state: string): string => {
    switch (state) {
        case 'NEW':
            return 'bg-blue-500 text-white';   // Blue for new
        case 'cancel_appointment':
            return 'bg-red-500 text-white';   // Red for canceled
        case 'REVIEWED':
            return 'bg-gray-500 text-white'; // Yellow for reviewed
        case 'COMPLETED':
            return 'bg-green-500 text-white';  // Green for completed
        case 'PENDING':
            return 'bg-gray-500 text-white';   // Gray for pending
        case 'IN_PROGRESS':
            return 'bg-orange-500 text-white'; // Orange for in progress
        case 'ARCHIVED':
            return 'bg-purple-500 text-white'; // Purple for archived
        default:
            return 'bg-gray-300 text-black';   // Default case (gray for unknown)
    }
}


export const getColumns: (setDeleteModalComponent:(component: any) => void,reLoadData:()=>void) => ColumnDef<Call>[] = (setDeleteModalComponent,reLoadData)=> {
    return [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "call_date",
            header: ({ column }) => {
                return <DataTableColumnHeader column={column} title="Date de l'appel" />
            },
            cell: ({row})=>{
                return <>{formatDateToLocal(row.getValue('call_date'), "fr-FR", true)}</>
            },
        },
        {
            accessorKey: "caller_phone",
            header: "Numero de telephone",
        },
        {
            accessorKey: "caller_fullname",
            // header: "Prenom",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Nom du patient" />
            ),
        },
        {
            accessorKey: "reason",
            header: ({ column }) => {
                return <DataTableColumnHeader column={column} title="Raison" />
            },
            cell: ({row})=>{
                return <>{getPlainTextCallReason(row.getValue('reason'))}</>
            }
        },
        {
            accessorKey: "comment",
            header: "Details" ,
            cell: ({row})=>{
                return <>{getPlainTextCallReason(row.getValue('comment'))}</>
            }
        },
        {
            accessorKey: "doctor_fullname",
            // header: "Prenom",
            // header: ({ column }) => (
            //     <DataTableColumnHeader column={column} title="Nom du medecin demandé" />
            // ),
            header: "Nom du medecin",
        },
        // {
        //     accessorKey: "created_at",
        //     header: "Date du system",
        //     cell: ({ row }) => {
        //         return <>{formatDateToLocal(row.getValue('created_at'))}</>
        //     },
        // },
        {
            accessorKey: "state",
            header: "Etat traitement",
            cell: ({ row }) => {
                return <div className="flex flex-row items-center ">
                            <div className={`text-xs px-1 py-0.5 ${getStatusColorTag(row.getValue('state'))} rounded-sm`}> {getPlainTextCallState(row.getValue('state'))} </div>
                        </div>
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MdOutlineMoreHoriz className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                                className="text-sm"
                            >
                                <CopyToClipboard text={`${row.getValue("caller_phone")}`}>
                                    Copier le numero
                                </CopyToClipboard>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-sm"
                                onClick={()=>{
                                    changeCallState(row.original.id , "REVIEWED").then(()=>{
                                        reLoadData()
                                    })
                                }}
                            >
                                Traiter l'appel
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },

    ]
}

