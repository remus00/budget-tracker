import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { Skeleton } from '../ui/skeleton';

interface Props {
    children: ReactNode;
    isLoading: boolean;
    fullWidth?: boolean;
    className?: string;
}

export const SkeletonWrapper = ({
    children,
    isLoading,
    fullWidth = true,
    className,
}: Props) => {
    if (!isLoading) return children;

    return (
        <Skeleton className={cn(fullWidth && 'w-full', className)}>
            <div className="opacity-0">{children}</div>
        </Skeleton>
    );
};
