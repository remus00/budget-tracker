'use client';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { getFormatterForCurrency } from '@/lib/helpers';
import { Period, TimeFrame } from '@/types/history';
import { UserSettings } from '@prisma/client';
import { useMemo, useState } from 'react';
import { HistoryPeriodSelector } from './history-period-selector';

export const History = ({ userSettings }: { userSettings: UserSettings }) => {
    const [timeFrame, setTimeFrame] = useState<TimeFrame>('month');
    const [period, setPeriod] = useState<Period>({
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
    });

    const formatter = useMemo(() => {
        return getFormatterForCurrency(userSettings.currency);
    }, [userSettings.currency]);

    return (
        <div className="container mx-auto px-8">
            <h2 className="mt-12 text-3xl font-bold">History</h2>
            <Card className="col-span-12 mt-4 w-full">
                <CardHeader className="gap-4">
                    <CardTitle className="grid grid-flow-row justify-between gap-4 md:grid-flow-col">
                        <HistoryPeriodSelector
                            period={period}
                            setPeriod={setPeriod}
                            timeFrame={timeFrame}
                            setTimeFrame={setTimeFrame}
                        />

                        <div className="flex h-10 gap-4">
                            <Badge
                                variant="outline"
                                className="flex items-center gap-2 text-xs"
                            >
                                <div className="size-4 rounded-full bg-emerald-500" />
                                Income
                            </Badge>

                            <Badge
                                variant="outline"
                                className="flex items-center gap-2 text-xs"
                            >
                                <div className="size-4 rounded-full bg-rose-500" />
                                Expense
                            </Badge>
                        </div>
                    </CardTitle>
                </CardHeader>
            </Card>
        </div>
    );
};
