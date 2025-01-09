'use client';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ButtonHTMLAttributes } from 'react';
import { Heading } from '../copy/heading';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon: string;
    label: string;
    path: string;
}

export const SidebarItem = ({ icon, label, path, ...rest }: Props) => {
    const pathname = usePathname();

    return (
        <Link href={path}>
            <Button
                variant="sidebar-item"
                size="default"
                {...rest}
                className={cn(
                    'relative w-full group-data-[collapsible=icon]:size-[40px]',
                    path === pathname && 'bg-neutral-100'
                )}
            >
                {icon && (
                    <Icon
                        icon={icon}
                        className={cn(
                            'shrink-0 text-[20px] text-neutral-500',
                            path === pathname && 'text-emerald-500'
                        )}
                    />
                )}
                <Heading
                    variant="label-sm"
                    className={cn(
                        'w-full text-start capitalize text-neutral-500 group-data-[collapsible=icon]:hidden',
                        path === pathname && 'text-neutral-950'
                    )}
                >
                    {label}
                </Heading>
            </Button>
        </Link>
    );
};
