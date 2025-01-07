import { Navbar } from '@/components/custom/navbar/navbar';
import { ReactNode } from 'react';

const DashboardLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="relative flex h-screen w-full flex-col">
            <Navbar />
            <div className="w-full">{children}</div>
        </div>
    );
};

export default DashboardLayout;
