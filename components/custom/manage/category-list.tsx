import { SkeletonWrapper } from '@/components/skeleton/skeleton-wrapper';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { TransactionType } from '@/types/transactions';
import { Category } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { PlusSquare, TrendingDown, TrendingUp } from 'lucide-react';
import { CreateCategoryDialog } from '../transactions/create-category-dialog';
import { CategoryCard } from './category-card';

export const CategoryList = ({
    type,
    className,
}: {
    type: TransactionType;
    className?: string;
}) => {
    const categoriesQuery = useQuery({
        queryKey: ['categories', type],
        queryFn: () => fetch(`/api/categories?type=${type}`).then((res) => res.json()),
    });

    const dataAvailable = categoriesQuery.data && categoriesQuery.data.length > 0;

    return (
        <SkeletonWrapper isLoading={categoriesQuery.isFetching}>
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                        <div className="flex items-center gap-2">
                            {type === 'expense' ? (
                                <TrendingDown className="!size-12 items-center rounded-lg bg-rose-400/10 p-2 text-rose-500" />
                            ) : (
                                <TrendingUp className="!size-12 items-center rounded-lg bg-emerald-400/10 p-2 text-emerald-500" />
                            )}

                            <div className="">
                                {type === 'expense' ? 'Expenses' : 'Incomes'} categories
                                <div className="text-sm text-muted-foreground">
                                    Sorted by name
                                </div>
                            </div>
                        </div>

                        <CreateCategoryDialog
                            type={type}
                            successCallback={() => categoriesQuery.refetch()}
                            trigger={
                                <Button className="gap-2 text-sm">
                                    <PlusSquare className="!size-4" /> Create category
                                </Button>
                            }
                        />
                    </CardTitle>
                </CardHeader>
                <Separator />
                {!dataAvailable ? (
                    <div className="flex h-40 w-full flex-col items-center justify-center">
                        <p className="">
                            No{' '}
                            <span
                                className={cn(
                                    type === 'expense'
                                        ? 'text-rose-500'
                                        : 'text-emerald-500'
                                )}
                            >
                                {type}
                            </span>{' '}
                            categories yet
                        </p>

                        <p className="text-sm text-muted-foreground">
                            Create one to get started
                        </p>
                    </div>
                ) : (
                    <div className="col-span-1 grid gap-4 p-4 sm:grid-flow-row sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {categoriesQuery.data.map((cat: Category, idx: number) => (
                            <CategoryCard key={idx} category={cat} />
                        ))}
                    </div>
                )}
            </Card>
        </SkeletonWrapper>
    );
};
