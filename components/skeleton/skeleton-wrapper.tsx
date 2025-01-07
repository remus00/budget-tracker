import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { Skeleton } from '../ui/skeleton';

interface Props {
    children: ReactNode;
    isLoading: boolean;
    fullWidth?: boolean;
}

export const SkeletonWrapper = ({ children, isLoading, fullWidth = true }: Props) => {
    if (!isLoading) return children;

    return (
        <Skeleton className={cn(fullWidth && 'w-full')}>
            <div className="opacity-10">{children}</div>
        </Skeleton>
    );
};
