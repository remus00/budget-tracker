import { HTMLAttributes, ReactNode } from 'react';
import { Heading } from '../copy/heading';

interface Props extends HTMLAttributes<HTMLDivElement> {
    label: string;
    children: ReactNode;
}

export const SidebarContentContainer = ({ label, children, ...rest }: Props) => {
    return (
        <div {...rest}>
            <Heading variant="sub-xs" className="mb-2 p-1 uppercase text-neutral-400">
                {label}
            </Heading>
            <div className="flex flex-col gap-1">{children}</div>
        </div>
    );
};
