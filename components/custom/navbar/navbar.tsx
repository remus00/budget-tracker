import { Separator } from '@/components/ui/separator';
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
        <header className="sticky top-0 z-50 flex h-[88px] w-full flex-col bg-background">
            <div className="flex items-center gap-3 px-8 py-5">
                <div className="shadow-xs grid size-12 shrink-0 place-content-center rounded-full border border-neutral-200">
                    {icon && (
                        <Icon
                            icon={icon}
                            className="shrink-0 text-[24px] text-neutral-950"
                        />
                    )}
                </div>

                <div className="flex w-full flex-col gap-1">
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
            <Separator />
        </header>
    );
};
