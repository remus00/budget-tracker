'use client';
import { SkeletonWrapper } from '@/components/skeleton/skeleton-wrapper';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getFormatterForCurrency } from '@/lib/helpers';
import { Period, TimeFrame } from '@/types/history';
import { UserSettings } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { Heading } from '../copy/heading';
import { HistoryPeriodSelector } from './history-period-selector';
import { CustomTooltip } from './tooltip/custom-tooltip';

export const History = ({ userSettings }: { userSettings: UserSettings }) => {
    const [timeFrame, setTimeFrame] = useState<TimeFrame>('month');
    const [period, setPeriod] = useState<Period>({
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
    });

    const formatter = useMemo(() => {
        return getFormatterForCurrency(userSettings.currency);
    }, [userSettings.currency]);

    const historyDataQuery = useQuery({
        queryKey: ['overview', 'history', timeFrame, period],
        queryFn: () =>
            fetch(
                `/api/history-data?timeFrame=${timeFrame}&year=${period.year}&month=${period.month}`
            ).then((res) => res.json()),
    });

    const dataAvailable = historyDataQuery.data && historyDataQuery.data.length > 0;

    return (
        <div className="mt-4">
            <Heading
                variant="h4"
                className="rounded-[16px] border border-neutral-200 bg-card p-4 font-bold"
            >
                History
            </Heading>
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
                <CardContent>
                    <SkeletonWrapper isLoading={historyDataQuery.isFetching}>
                        {dataAvailable ? (
                            <ResponsiveContainer width={'100%'} height={300}>
                                <BarChart
                                    height={300}
                                    data={historyDataQuery.data}
                                    barCategoryGap={5}
                                >
                                    <defs>
                                        <linearGradient
                                            id="income-bar"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="0"
                                                stopColor="#10b981"
                                                stopOpacity="1"
                                            />
                                            <stop
                                                offset="1"
                                                stopColor="#10b981"
                                                stopOpacity="0"
                                            />
                                        </linearGradient>
                                    </defs>

                                    <defs>
                                        <linearGradient
                                            id="expense-bar"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="0"
                                                stopColor="#ef4444"
                                                stopOpacity="1"
                                            />
                                            <stop
                                                offset="1"
                                                stopColor="#ef4444"
                                                stopOpacity="0"
                                            />
                                        </linearGradient>
                                    </defs>

                                    <CartesianGrid
                                        strokeDasharray="5 5"
                                        strokeOpacity={0.2}
                                    />
                                    <XAxis
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        padding={{ left: 5, right: 5 }}
                                        dataKey={(data) => {
                                            const { year, month, day } = data;
                                            const date = new Date(year, month, day || 1);

                                            if (timeFrame === 'year') {
                                                return date.toLocaleString('en-US', {
                                                    month: 'long',
                                                });
                                            }

                                            return date.toLocaleString('en-US', {
                                                day: '2-digit',
                                            });
                                        }}
                                    />

                                    <YAxis
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Bar
                                        dataKey="income"
                                        label="Income"
                                        fill="url(#income-bar)"
                                        radius={4}
                                        className="cursor-pointer"
                                    />
                                    <Bar
                                        dataKey="expense"
                                        label="Expense"
                                        fill="url(#expense-bar)"
                                        radius={4}
                                        className="cursor-pointer"
                                    />

                                    <Tooltip
                                        cursor={{ opacity: 0.1 }}
                                        content={(props) => (
                                            <CustomTooltip
                                                formatter={formatter}
                                                {...props}
                                            />
                                        )}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <Card className="flex h-[300px] flex-col items-center justify-center bg-background">
                                No data for the selected period
                                <p className="text-sm text-muted-foreground">
                                    Try selecting a different period or adding a new
                                    transaction
                                </p>
                            </Card>
                        )}
                    </SkeletonWrapper>
                </CardContent>
            </Card>
        </div>
    );
};
