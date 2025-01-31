import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Period } from '@/types/history';
import { Dispatch, SetStateAction } from 'react';

interface Props {
    period: Period;
    setPeriod: Dispatch<SetStateAction<Period>>;
}

export const MonthSelector = ({ period, setPeriod }: Props) => {
    return (
        <Select
            value={period.month.toString()}
            onValueChange={(val) =>
                setPeriod({ year: period.year, month: parseInt(val) })
            }
        >
            <SelectTrigger className="w-[180px] border border-neutral-200 bg-white text-neutral-500 shadow-[0px_1px_2px_0px_rgba(82,88,102,0.06)] hover:border-transparent hover:bg-neutral-100 hover:text-neutral-900 focus:border-neutral-900 focus:text-neutral-900 focus:ring-0 disabled:border-transparent">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((month) => {
                    const monthToString = new Date(period.year, month, 1).toLocaleString(
                        'en-Us',
                        { month: 'long' }
                    );

                    return (
                        <SelectItem key={month} value={month.toString()}>
                            {monthToString}
                        </SelectItem>
                    );
                })}
            </SelectContent>
        </Select>
    );
};
