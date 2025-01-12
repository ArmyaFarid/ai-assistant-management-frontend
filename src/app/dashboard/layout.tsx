'use client';


import PageGuard from "@/security/page-guard";
import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/app-sidebar";
import {Separator} from "@/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import DynamicBreadcrumb from "@/ui/dynamic-breadcrumb";
import {useHttpGet} from "@/lib/services/api/hooks/httpHooks";
import {Account, User} from "@/lib/definitions";
import {useEffect} from "react";

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {

    const { data : userInfo , loading  } = useHttpGet<User>('/users/me')

    useEffect(() => {
        console.log(userInfo)
    }, [userInfo]);

    return (
        <>
            <PageGuard  failRedirectUrl={"/login"}/>
            <SidebarProvider>
                <AppSidebar user={userInfo}/>
                <SidebarInset>
                    <header className="fixed flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                            <Separator orientation="vertical" className="mr-2 h-4" />
                            <DynamicBreadcrumb/>
                        </div>
                    </header>
                    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 mt-16">
                        {children}
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </>
    );
}
