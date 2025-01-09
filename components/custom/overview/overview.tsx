'use client';
import { MAX_DATE_RANGE_DAYS } from '@/constants';
import { UserSettings } from '@prisma/client';
import { differenceInDays, startOfMonth } from 'date-fns';
import { useState } from 'react';
import { toast } from 'sonner';
import { DateRangePicker } from '../../ui/date-range-picker';
import { Heading } from '../copy/heading';
import { CategoryStats } from './category-stats';
import { StatsCards } from './stats-cards';

export const Overview = ({ userSettings }: { userSettings: UserSettings }) => {
    const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
        from: startOfMonth(new Date()),
        to: new Date(),
    });

    return (
        <>
            <div className="mt-4 flex w-full justify-between rounded-[16px] border border-neutral-200 bg-card p-4 shadow-md">
                <Heading variant="h4" className="font-bold">
                    Overview
                </Heading>
                <DateRangePicker
                    initialDateFrom={dateRange.from}
                    initialDateTo={dateRange.to}
                    showCompare={false}
                    onUpdate={(values) => {
                        const { from, to } = values.range;

                        if (!from || !to) return;

                        if (differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
                            toast.error(
                                `The selected range is too big. Max allowed range is ${MAX_DATE_RANGE_DAYS} days.`
                            );
                            return;
                        }

                        setDateRange({ from, to });
                    }}
                />
            </div>

            <div className="mt-4">
                <StatsCards
                    userSettings={userSettings}
                    from={dateRange.from}
                    to={dateRange.to}
                />

                <CategoryStats
                    userSettings={userSettings}
                    from={dateRange.from}
                    to={dateRange.to}
                />
            </div>
        </>
    );
};
