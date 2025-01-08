'use client';

import { DateRangePicker } from '@/components/ui/date-range-picker';
import { MAX_DATE_RANGE_DAYS } from '@/constants';
import { differenceInDays, startOfMonth } from 'date-fns';
import { useState } from 'react';
import { toast } from 'sonner';
import { TransactionsTable } from './transactions-table';

export const TransactionsPageWrapper = () => {
    const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
        from: startOfMonth(new Date()),
        to: new Date(),
    });

    return (
        <>
            <div className="border-b bg-card">
                <div className="container mx-auto flex items-center justify-between gap-6 p-8">
                    <div className="">
                        <p className="text-3xl font-bold">Transactions history</p>
                    </div>
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

            <div className="container mx-auto p-9">
                <TransactionsTable from={dateRange.from} to={dateRange.to} />
            </div>
        </>
    );
};
