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
        <header className="shadow-navbar sticky top-4 z-50 flex h-[72px] w-full rounded-[16px] border border-neutral-200 bg-card">
            <div className="flex w-full items-center gap-3 p-4">
                <div className="shadow-xs grid size-10 shrink-0 place-content-center rounded-[12px] border border-emerald-400/50 bg-emerald-400/10">
                    {icon && (
                        <Icon
                            icon={icon}
                            className="shrink-0 text-[24px] text-emerald-500"
                        />
                    )}
                </div>

                <div className="flex w-full flex-col">
                    <Heading variant="label-lg" className="text-neutral-950">
                        {label}
                    </Heading>
                    {description && (
                        <Paragraph variant="sm" className="text-neutral-600">
                            {description}
                        </Paragraph>
                    )}
                </div>

                {/* the outlined button */}
                {secondaryButton && secondaryButton}

                {/* the filled button */}
                {button && button}
            </div>
        </header>
    );
};
