import { HTMLAttributes, ReactNode } from 'react';
import { Heading } from '../copy/heading';

interface Props extends HTMLAttributes<HTMLDivElement> {
    label: string;
    children: ReactNode;
    trigger: ReactNode;
}

export const SidebarContentContainer = ({ label, children, trigger, ...rest }: Props) => {
    return (
        <div {...rest}>
            <div className="mb-4 flex items-center justify-between group-data-[collapsible=icon]:justify-center">
                <Heading
                    variant="sub-xs"
                    className="p-1 uppercase text-neutral-400 group-data-[collapsible=icon]:hidden"
                >
                    {label}
                </Heading>
                {trigger}
            </div>
            <div className="flex flex-col gap-1 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center">
                {children}
            </div>
        </div>
    );
};
