import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
return (
    <SidebarProvider>
    <AppSidebar />
    <main>
        {children}
    </main>
    </SidebarProvider>
);
}