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
        <div className="flex w-auto flex-wrap gap-4 md:flex-nowrap">
            <SkeletonWrapper isLoading={statsQuery.isFetching}>
                <CategoriesCard
                    formatter={formatter}
                    data={statsQuery.data || []}
                    type="income"
                />

                <CategoriesCard
                    formatter={formatter}
                    data={statsQuery.data || []}
                    type="expense"
                />
            </SkeletonWrapper>
        </div>
    );
};
