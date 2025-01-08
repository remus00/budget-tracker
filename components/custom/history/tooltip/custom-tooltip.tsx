import React from 'react';
import { TooltipRow } from './tooltip-row';

export const CustomTooltip = ({ active, payload, formatter }: any) => {
    if (!active || !payload || payload.length === 0) return null;

    const { expense, income } = payload[0].payload;

    return (
        <div className="min-w-[300px] rounded border bg-background p-4">
            <TooltipRow
                formatter={formatter}
                label="Expense"
                value={expense}
                bgColor="bg-rose-500"
                textColor="text-rose-500"
            />
            <TooltipRow
                formatter={formatter}
                label="Income"
                value={income}
                bgColor="bg-emerald-500"
                textColor="text-emerald-500"
            />{' '}
            <TooltipRow
                formatter={formatter}
                label="Balance"
                value={income - expense}
                bgColor="bg-violet-500"
                textColor="text-violet-500"
            />
        </div>
    );
};
