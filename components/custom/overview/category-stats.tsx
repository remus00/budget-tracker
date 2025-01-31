import { GetCategoriesResponseType } from '@/app/api/stats/categories/route';
import { SkeletonWrapper } from '@/components/skeleton/skeleton-wrapper';
import { dateToUTCDate, getFormatterForCurrency } from '@/lib/helpers';
import { UserSettings } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { CategoriesCard } from './categories-card';

interface Props {
    userSettings: UserSettings;
    from: Date;
    to: Date;
}

export const CategoryStats = ({ userSettings, from, to }: Props) => {
    const statsQuery = useQuery<GetCategoriesResponseType>({
        queryKey: ['overview', 'stats', 'categories', from, to],
        queryFn: () =>
            fetch(
                `/api/stats/categories?from=${dateToUTCDate(from)}&to=${dateToUTCDate(to)}`
            ).then((res) => res.json()),
    });

    const formatter = useMemo(() => {
        return getFormatterForCurrency(userSettings.currency);
    }, [userSettings.currency]);

    return (
        <div className="mt-4 grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
            <SkeletonWrapper isLoading={statsQuery.isFetching}>
                <CategoriesCard
                    formatter={formatter}
                    data={statsQuery.data || []}
                    type="income"
                />
            </SkeletonWrapper>
            <SkeletonWrapper isLoading={statsQuery.isFetching}>
                <CategoriesCard
                    formatter={formatter}
                    data={statsQuery.data || []}
                    type="expense"
                />
            </SkeletonWrapper>
        </div>
    );
};
