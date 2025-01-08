import { cn } from '@/lib/utils';
import { useCallback } from 'react';
import CountUp from 'react-countup';

interface Props {
    formatter: Intl.NumberFormat;
    label: string;
    value: number;
    bgColor: string;
    textColor: string;
}

export const TooltipRow = ({ formatter, label, value, bgColor, textColor }: Props) => {
    const formattingFn = useCallback(
        (val: number) => {
            return formatter.format(val);
        },
        [formatter]
    );

    return (
        <div className="flex items-center gap-2">
            <div className={cn('size-4 shrink-0 rounded-full', bgColor)} />
            <div className="flex w-full justify-between">
                <p className="text-sm text-muted-foreground">{label}</p>
                <div className={cn('text-sm font-bold', textColor)}>
                    <CountUp
                        duration={0.5}
                        preserveValue
                        end={value}
                        decimals={0}
                        formattingFn={formattingFn}
                        className="text-sm"
                    />
                </div>
            </div>
        </div>
    );
};
