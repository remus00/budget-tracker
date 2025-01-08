'use client';
import { GetHistoryPeriodsResponseType } from '@/app/api/history-periods/route';
import { SkeletonWrapper } from '@/components/skeleton/skeleton-wrapper';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Period, TimeFrame } from '@/types/history';
import { useQuery } from '@tanstack/react-query';
import { Dispatch, SetStateAction } from 'react';
import { MonthSelector } from './month-selector';
import { YearSelector } from './year-selector';

interface Props {
    period: Period;
    setPeriod: Dispatch<SetStateAction<Period>>;
    timeFrame: TimeFrame;
    setTimeFrame: Dispatch<SetStateAction<TimeFrame>>;
}

export const HistoryPeriodSelector = ({
    period,
    setPeriod,
    timeFrame,
    setTimeFrame,
}: Props) => {
    const historyPeriodsQuery = useQuery<GetHistoryPeriodsResponseType>({
        queryKey: ['overview', 'history', 'periods'],
        queryFn: () => fetch(`/api/history-periods`).then((res) => res.json()),
    });

    return (
        <div className="flex flex-wrap items-center gap-4">
            <SkeletonWrapper isLoading={historyPeriodsQuery.isFetching} fullWidth={false}>
                <Tabs
                    value={timeFrame}
                    onValueChange={(val) => setTimeFrame(val as TimeFrame)}
                >
                    <TabsList>
                        <TabsTrigger value="year">Year</TabsTrigger>
                        <TabsTrigger value="month">Month</TabsTrigger>
                    </TabsList>
                </Tabs>
            </SkeletonWrapper>

            <div className="flex flex-wrap items-center gap-4">
                <SkeletonWrapper isLoading={historyPeriodsQuery.isFetching}>
                    <YearSelector
                        period={period}
                        setPeriod={setPeriod}
                        years={historyPeriodsQuery.data || []}
                    />
                </SkeletonWrapper>

                {timeFrame === 'month' && (
                    <SkeletonWrapper
                        isLoading={historyPeriodsQuery.isFetching}
                        fullWidth={false}
                    >
                        <MonthSelector period={period} setPeriod={setPeriod} />
                    </SkeletonWrapper>
                )}
            </div>
        </div>
    );
};
