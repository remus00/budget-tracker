'use client';
import { MAX_DATE_RANGE_DAYS } from '@/constants';
import { UserSettings } from '@prisma/client';
import { differenceInDays, startOfMonth } from 'date-fns';
import { useState } from 'react';
import { toast } from 'sonner';
import { DateRangePicker } from '../../ui/date-range-picker';
import { CategoryStats } from './category-stats';
import { StatsCards } from './stats-cards';

export const Overview = ({ userSetting }: { userSetting: UserSettings }) => {
    const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
        from: startOfMonth(new Date()),
        to: new Date(),
    });

    return (
        <>
            <div className="container mx-auto flex flex-wrap justify-between gap-2 px-8 py-6">
                <h2 className="text-3xl font-bold">Overview</h2>
                <div className="flex items-center gap-3">
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
            </div>

            <div className="container mx-auto flex flex-col gap-4 px-8">
                <StatsCards
                    userSettings={userSetting}
                    from={dateRange.from}
                    to={dateRange.to}
                />

                <CategoryStats
                    userSettings={userSetting}
                    from={dateRange.from}
                    to={dateRange.to}
                />
            </div>
        </>
    );
};
