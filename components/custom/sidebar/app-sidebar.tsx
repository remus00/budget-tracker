import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarSeparator,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import { UserButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Heading } from '../copy/heading';
import { Paragraph } from '../copy/paragraph';
import { Logo } from '../logo';
import { SidebarContentContainer } from './sidebar-content-container';
import { SidebarItem } from './sidebar-item';

export const AppSidebar = async () => {
    const user = await currentUser();

    if (!user) redirect('/sign-in');

    return (
        <Sidebar variant="floating" collapsible="icon">
            <SidebarHeader>
                <Logo />
            </SidebarHeader>

            <SidebarSeparator />

            <SidebarContent>
                <SidebarContentContainer label="main" trigger={<SidebarTrigger />}>
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

            <SidebarFooter className="flex flex-row items-center justify-center gap-2">
                <UserButton
                    afterSignOutUrl="/sign-in"
                    appearance={{
                        elements: {
                            userButtonAvatarBox:
                                'size-10 rounded-[12px] border border-neutral-200',
                            userButtonTrigger: 'rounded-[12px]',
                        },
                    }}
                />
                <div className="flex w-full flex-col group-data-[collapsible=icon]:hidden">
                    <Heading
                        variant="label-sm"
                        className="max-w-[160px] truncate text-neutral-950"
                    >
                        {user.lastName} {user.firstName}
                    </Heading>
                    <Paragraph
                        variant="xs"
                        className="w-full max-w-[160px] truncate text-neutral-600"
                    >
                        {user.emailAddresses[0].emailAddress}
                    </Paragraph>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
};
