import { GetBalanceResponseType } from '@/app/api/stats/balance/route';
import { SkeletonWrapper } from '@/components/skeleton/skeleton-wrapper';
import { dateToUTCDate, getFormatterForCurrency } from '@/lib/helpers';
import { UserSettings } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { useMemo } from 'react';
import { StatsCard } from './stats-card';

interface Props {
    userSettings: UserSettings;
    from: Date;
    to: Date;
}

export const StatsCards = ({ userSettings, from, to }: Props) => {
    const statsQuery = useQuery<GetBalanceResponseType>({
        queryKey: ['overview', 'stats', from, to],
        queryFn: () =>
            fetch(
                `/api/stats/balance?from=${dateToUTCDate(from)}&to=${dateToUTCDate(to)}`
            ).then((res) => res.json()),
    });

    const formatter = useMemo(() => {
        return getFormatterForCurrency(userSettings.currency);
    }, [userSettings.currency]);

    const income = statsQuery.data?.income || 0;
    const expense = statsQuery.data?.expense || 0;

    const balance = income - expense;

    return (
        <div className="container relative mx-auto flex w-full flex-wrap gap-2 px-8 md:flex-nowrap">
            <SkeletonWrapper isLoading={statsQuery.isFetching}>
                <StatsCard
                    formatter={formatter}
                    value={income}
                    title="Income"
                    icon={
                        <TrendingUp className="!size-12 items-center rounded-lg bg-emerald-400/10 p-2 text-emerald-500" />
                    }
                />
            </SkeletonWrapper>

            <SkeletonWrapper isLoading={statsQuery.isFetching}>
                <StatsCard
                    formatter={formatter}
                    value={expense}
                    title="Expense"
                    icon={
                        <TrendingDown className="!size-12 items-center rounded-lg bg-rose-400/10 p-2 text-rose-500" />
                    }
                />
            </SkeletonWrapper>

            <SkeletonWrapper isLoading={statsQuery.isFetching}>
                <StatsCard
                    formatter={formatter}
                    value={balance}
                    title="Balance"
                    icon={
                        <Wallet className="!size-12 items-center rounded-lg bg-violet-400/10 p-2 text-violet-500" />
                    }
                />
            </SkeletonWrapper>
        </div>
    );
};
