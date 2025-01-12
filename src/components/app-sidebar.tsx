"use client"

import * as React from "react"
import {
    AudioWaveform,
    BookOpen,
    Bot,
    Command,
    Frame,
    GalleryVerticalEnd,
    Map,
    PieChart,
    Settings2,
    Info,
    SquareTerminal, Sliders,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { AccountSwitcher } from "@/components/account-switcher"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"
import {User} from "@/lib/definitions";
import {useEffect, useState} from "react";

// This is sample data.
const data = {
    user: {
        name: "farid",
        email: "farid@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    accounts: [
        {
            name: "Mon premier compte",
            logo: GalleryVerticalEnd,
            plan: "Enterprise",
        },
    ],
    navMain: [
        {
            title: "General",
            url: "#",
            icon: Sliders,
            isActive: true,
            items: [
                {
                    title: "Statistiques",
                    url: "#",
                },
                {
                    title: "Facturations",
                    url: "#",
                },
                {
                    title: "Settings",
                    url: "#",
                },
            ],
        },
        {
            title: "Assistants AI",
            url: "#",
            isActive: true,
            icon: Bot,
            items: [
                {
                    title: "Mes assistants",
                    url: "/dashboard/assistants",
                },
                {
                    title: "Numero de telephones",
                    url: "/dashboard/numbers",
                },
            ],
        },
        {
            title: "Settings",
            url: "#",
            icon: Settings2,
            items: [
                {
                    title: "General",
                    url: "#",
                },
                {
                    title: "Team",
                    url: "#",
                },
                {
                    title: "Billing",
                    url: "#",
                },
                {
                    title: "Limits",
                    url: "#",
                },
            ],
        },
    ],
    projects: [
        {
            name: "Design Engineering",
            url: "#",
            icon: Frame,
        },
        {
            name: "Sales & Marketing",
            url: "#",
            icon: PieChart,
        },
        {
            name: "Travel",
            url: "#",
            icon: Map,
        },
    ],
}

type ProfileProps = {
    user : User | null
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar> & ProfileProps) {

    const [ accounts , setAccounts ] = useState<any>(
        [
            {
                name: '---',
                logo: GalleryVerticalEnd,
                sid: '---',
            },
        ]
    );


    const [ profile , setProfile ] = useState<any>(
        {
            accounts :        [
                {
                    name: '---',
                    logo: GalleryVerticalEnd,
                    sid: '---',
                },
            ],
            user: {
                name: "----",
                email: "----",
                avatar: "/avatars/shadcn.jpg",
            }
        }

    );

    useEffect(() => {
        setAccounts(
            [
                {
                    name: props.user?.account.name || '---',
                    logo: GalleryVerticalEnd,
                    sid: props.user?.account.accountSid || '---',
                },
            ]
        )

        setProfile(
            {
                accounts :        [
                    {
                        name: props.user?.account.name || '---',
                        logo: GalleryVerticalEnd,
                        sid: props.user?.account.accountSid || '---',
                    },
                ],
                user: {
                    name: props.user?.fullName || "----",
                    email: props.user?.email || "----",
                    avatar: "/avatars/shadcn.jpg",
                }
            }
        );
    }, [props.user]);
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                {accounts && <AccountSwitcher accounts={profile.accounts}/>}
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                {/*<NavProjects projects={data.projects} />*/}
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={profile.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
