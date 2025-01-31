import { SidebarTrigger } from '@/components/ui/sidebar';
import { Icon } from '@iconify/react';
import { ReactNode } from 'react';
import { Heading } from '../copy/heading';
import { Paragraph } from '../copy/paragraph';

interface Props {
    icon?: string;
    label: string;
    description?: string;
    button?: ReactNode;
    secondaryButton?: ReactNode;
}

export const Navbar = ({ icon, label, description, button, secondaryButton }: Props) => {
    return (
        <header className="sticky top-4 z-50 flex h-fit w-full flex-col gap-4 rounded-[16px] border border-neutral-200 bg-card p-4 shadow-navbar md:h-[72px] md:flex-row">
            <div className="flex w-full items-center gap-4">
                <div className="grid size-10 shrink-0 place-content-center rounded-[12px] border border-emerald-400/50 bg-emerald-400/10 shadow-xs">
                    {icon && (
                        <Icon
                            icon={icon}
                            className="shrink-0 text-[24px] text-emerald-500"
                        />
                    )}
                </div>

                <div className="flex w-full items-center justify-between">
                    <div>
                        <Heading variant="label-lg" className="text-neutral-950">
                            {label}
                        </Heading>
                        {description && (
                            <Paragraph variant="sm" className="text-neutral-600">
                                {description}
                            </Paragraph>
                        )}
                    </div>

                    <SidebarTrigger className="ml-2 flex md:hidden" />
                </div>
            </div>
            <div className="flex items-center gap-4">
                {/* the outlined button */}
                {secondaryButton && secondaryButton}
                {/* the filled button */}
                {button && button}
            </div>
        </header>
    );
};
