'use client';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Props {
    label: string;
    link: string;
    onClickHandler?: () => void;
}

export const NavbarItem = ({ label, link, onClickHandler }: Props) => {
    const path = usePathname();
    const isActive = path === link;

    return (
        <div className="relative flex items-center">
            <Link
                href={link}
                className={cn(
                    'text-muted-foreground w-full justify-start text-lg transition-colors hover:text-foreground',
                    buttonVariants({ variant: 'ghost' }),
                    isActive && 'text-foreground'
                )}
                onClick={onClickHandler && onClickHandler}
            >
                {label}
            </Link>
            {isActive && (
                <div className="absolute bottom-1 left-1/2 hidden h-[2px] w-[80%] -translate-x-1/2 rounded-xl bg-foreground md:block" />
            )}
        </div>
    );
};
