"use client";

import {useHttpGet} from "@/lib/services/api/hooks/httpHooks";
import {useEffect, useState} from "react";
import {Call, Paginator} from "@/lib/definitions";
import * as React from "react";

import {usePathname} from "next/navigation";
import {DataTable} from "@/app/calls/data-table";
import {getColumns} from "@/app/calls/columns";
import PageGuard from "@/security/page-guard";



export default function Page() {

    const today = new Date();
    const todayString = today.toISOString().split('T')[0]

    const pathname = usePathname()

    const [components, setComponents] = useState<JSX.Element[]>([]);

    const { data : calls , metadata , refetch } = useHttpGet<Call[]>(`/calls?date=${todayString}`);

    const [lastDatequery , setLastDatequery] = useState<string>();

    const reLoadData = (paginator? : Paginator , date? : string) => {
        if(paginator){
            // refetch(`/calls?limit=${paginator.size}&page=${paginator.page}`);
        }else{
            if(date){
                setLastDatequery(date);
                refetch(`/calls?date=${date}`);
            }else{
                const today = new Date();
                const todayString = lastDatequery ?? today.toISOString().split('T')[0]
                refetch(`/calls?date=${todayString}`);
            }
        }

    }

    // Function to add a new component
    const addComponent = (newComponent: any) => {
        setComponents([...components, newComponent]);
    };


    useEffect(() => {
        reLoadData();
    }, [pathname]);

    // const columns = getColumns(addComponent, reLoadData);
    return (
        <div className="container mx-auto py-10">

            {components}

            {calls && <DataTable<Call,Call> columns={getColumns(addComponent, reLoadData)} data={calls as Call[]} reLoadData={reLoadData} paginationMetadata={metadata}/>}

            {!calls && <DataTable<Call,Call> columns={getColumns(addComponent, reLoadData)} data={[] as Call[]} reLoadData={reLoadData} paginationMetadata={metadata}/>}

        </div>
    )
}

