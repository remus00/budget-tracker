import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarSeparator,
} from '@/components/ui/sidebar';
import { UserButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Heading } from '../copy/heading';
import { Paragraph } from '../copy/paragraph';
import { Logo } from '../logo';
import { ThemeSwitcherButton } from '../theme-switcher-button';
import { SidebarContentContainer } from './sidebar-content-container';
import { SidebarItem } from './sidebar-item';

export const AppSidebar = async () => {
    const user = await currentUser();

    if (!user) redirect('/sign-in');

    return (
        <Sidebar>
            <SidebarHeader className="flex h-[88px] items-center justify-center bg-background p-6 shadow-none">
                <Logo />
            </SidebarHeader>
            <SidebarSeparator />
            <SidebarContent className="gap-5 bg-background px-5 pb-4 pt-5">
                <SidebarContentContainer label="main">
                    <SidebarItem
                        icon="lucide:layout-dashboard"
                        label="dashboard"
                        path="/"
                    />

                    <SidebarItem
                        icon="lucide:badge-euro"
                        label="transactions"
                        path="/transactions"
                    />

                    <SidebarItem icon="lucide:settings-2" label="manage" path="/manage" />
                </SidebarContentContainer>
            </SidebarContent>
            <SidebarSeparator />
            <SidebarFooter className="bg-background p-6">
                <div className="grid grid-cols-5 items-center gap-3">
                    <div className="col-span-1 size-10 rounded-full">
                        <UserButton
                            afterSignOutUrl="/sign-in"
                            appearance={{
                                elements: {
                                    userButtonAvatarBox:
                                        'size-10 border border-neutral-200',
                                },
                            }}
                        />
                    </div>
                    <div className="col-span-3 flex w-full flex-col gap-1">
                        <Heading variant="label-sm" className="text-neutral-950">
                            {user.lastName} {user.firstName}
                        </Heading>
                        <Paragraph variant="xs" className="truncate text-neutral-600">
                            {user.emailAddresses[0].emailAddress}
                        </Paragraph>
                    </div>
                    <ThemeSwitcherButton className="col-span-1" />
                </div>
            </SidebarFooter>
        </Sidebar>
    );
};
