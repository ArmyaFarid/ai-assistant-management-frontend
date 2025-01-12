"use client"

import {
    ColumnDef, ColumnFiltersState,
    flexRender,
    getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, PaginationState, SortingState,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {Button} from "@/components/ui/button";
import {useEffect, useMemo, useState} from "react";
import {Input} from "@/components/ui/input";
import Link from "next/link";
import {toast} from "@/components/ui/use-toast";
import {useHttpDelete} from "@/lib/services/api/hooks/httpHooks";
import { format } from "date-fns"
import {Paginator} from "@/lib/definitions";
import {cn, exportToExcel, formatDateToLocal} from "@/lib/utils";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {CalendarIcon} from "lucide-react";
import {Calendar} from "@/components/ui/calendar";
import {TfiReload} from "react-icons/tfi";

type PaginationMetadata = {
    totalCount: number;
    page: number;
    perPage: number;
}
interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[],
    reLoadData:(paginator? : Paginator , date? : string)=>void,
    paginationMetadata : PaginationMetadata,
}

export function DataTable<TData, TValue>({columns, data, reLoadData , paginationMetadata}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [openAddUserModal, setOpenAddUserModal] = useState<boolean>(false);
    const [date, setDate] = useState<Date>(new Date())


    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )
    const [rowSelection, setRowSelection] = useState({})

    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 0, //initial page index
        pageSize: paginationMetadata?.perPage ?? 5, //default page size
    });

    useEffect(() => {
        const dataString = date?.toISOString().split('T')[0];
        reLoadData(undefined,dataString);
    }, [date]);


    const pagination = useMemo(
        () => ({
            pageIndex,
            pageSize,
        }),
        [pageIndex, pageSize]
    )

    useEffect(() => {
        reLoadData({page:pageIndex+1,size:pageSize});
    }, [pageIndex, pageSize])

    const table = useReactTable({
        data,
        columns,
        manualPagination: true,
        getCoreRowModel: getCoreRowModel(),
        // getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
        onPaginationChange: setPagination,
        rowCount: paginationMetadata?.totalCount ?? 1,
        // initialState: {
        //     pagination: {
        //         pageIndex: 2, //custom initial page index
        //         pageSize: 25, //custom default page size
        //     },
        // },
        state: {
            sorting,
            columnFilters,
            rowSelection,
            pagination
        },
    })

    const deleteSelectedAdmins = async () => {
        const selectedRowModel = table.getSelectedRowModel();
        const responses = [];
        for (const row of selectedRowModel.rows) {
            const originals = row.original as any;
            console.log(originals)
            // const res = deleteAdmin(originals?.id);
            // responses.push(res)
        }
        // await Promise.all(responses).then(
        //     (values) => {
        //         console.log(values);
        //     },
        //     (reason) => {
        //         console.log(reason);
        //     },
        // )
        // .finally(() => {
        //     const id = toast({
        //         title: "Action terminee",
        //         description: "Tous les utilisateurs ont ete supprimes",
        //     });
        //     reLoadData();
        // });
    }

    const handleSelect = (selectedDate: Date | undefined) => {
        if(selectedDate)
        setDate(selectedDate); // Pass selected date or undefined to setDate
    };

    return (
        <div>
            <div className="flex items-center py-4 gap-4">
                <div>
                    <Input
                        placeholder="Filter title..."
                        value={(table.getColumn("caller_phone")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("caller_phone")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                </div>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-[280px] flex justify-start gap-4 text-left font-normal",
                                !date && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon />
                            {date ? formatDateToLocal(date.toISOString(), "fr") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={handleSelect}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>

                <div>
                    <Button onClick={()=>{
                        const dataString = date?.toISOString().split('T')[0];
                        reLoadData(undefined,dataString)
                    }}
                    className="flex gap-2"
                    >
                        <TfiReload />
                        <div>Rafraichir</div>
                    </Button>
                </div>

                <div>
                    <Button className="bg-primary" onClick={()=>{
                        exportToExcel(data , 'export_calls')
                    }}>
                            Exporter la liste
                    </Button>
                </div>
                <div>
                    {
                        table.getIsAllRowsSelected() &&
                        <Button variant="destructive"
                                onClick={()=>deleteSelectedAdmins()}
                        >
                            Exporter
                        </Button>
                    }
                </div>

                <div>
                    {
                        table.getIsSomeRowsSelected() &&
                        <Button variant="destructive"
                                onClick={()=>deleteSelectedAdmins()}
                        >
                            Exporter la selection
                        </Button>
                    }
                </div>

            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Aucune donnes trouvees.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                    Page {table.getState().pagination.pageIndex + 1} of{" "}
                    {table.getPageCount()}
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <select
                    value={table.getState().pagination.pageSize}
                    onChange={e => {
                        table.setPageSize(Number(e.target.value))

                        setPagination((prevState: PaginationState) => ({
                            ...prevState,
                            pageSize: Number(e.target.value), // Ensure the value is a number
                        }));
                    }}
                >
                    {[5 , 10, 20, 30, 40, 50].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            {pageSize}
                        </option>
                    ))}
                </select>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}
