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
            <SelectTrigger className="w-[180px]">
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
