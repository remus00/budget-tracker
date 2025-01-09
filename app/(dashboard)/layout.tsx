import { AppSidebar } from '@/components/custom/sidebar/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ReactNode } from 'react';

const DashboardLayout = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <SidebarProvider>
                <AppSidebar />
                <main className="flex h-screen w-full flex-1 flex-col bg-background p-4">
                    {children}
                </main>
            </SidebarProvider>
        </>
    );
};

export default DashboardLayout;
