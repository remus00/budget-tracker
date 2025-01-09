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
                className={cn('relative', path === pathname && 'bg-neutral-100')}
            >
                {path === pathname && (
                    <div className="bg-gold-500 absolute -left-5 top-1/2 h-5 w-1 -translate-y-1/2 cursor-default select-none rounded-br-[4px] rounded-tr-[4px] transition-all" />
                )}

                {icon && (
                    <Icon
                        icon={icon}
                        className={cn(
                            'shrink-0 text-[20px] text-neutral-600',
                            path === pathname && 'text-gold-500'
                        )}
                    />
                )}
                <Heading
                    variant="label-sm"
                    className={cn(
                        'w-full text-start capitalize text-neutral-600',
                        path === pathname && 'text-neutral-950'
                    )}
                >
                    {label}
                </Heading>
                {pathname === path && (
                    <Icon
                        icon="ri:arrow-right-s-line"
                        className="shrink-0 text-[20px] text-neutral-600"
                    />
                )}
            </Button>
        </Link>
    );
};
