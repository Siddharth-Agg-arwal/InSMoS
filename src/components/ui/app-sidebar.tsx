"use client"
import { useRouter } from "next/navigation" // Add this import
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items with actual routes.
const items = [
    {
        title: "Dashboard",
        url: "/in/dashboard",
        icon: Home,
    },
    {
        title: "Live Feed",
        url: "/in/live-feed",
        icon: Inbox,
    },
    {
        title: "Appointments",
        url: "/in/appointments",
        icon: Calendar,
    },
    {
        title: "Patients",
        url: "/in/patients",
        icon: Search,
    },
    {
        title: "Settings",
        url: "/in/settings",
        icon: Settings,
    },
]

export function AppSidebar() {
    const router = useRouter() // Use the router

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        onClick={() => router.push(item.url)}
                                    >
                                        <button
                                            type="button"
                                            className="flex items-center gap-2 w-full text-left"
                                        >
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </button>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}