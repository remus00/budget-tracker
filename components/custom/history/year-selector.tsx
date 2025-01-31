import { GetHistoryPeriodsResponseType } from '@/app/api/history-periods/route';
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
    years: GetHistoryPeriodsResponseType;
}

export const YearSelector = ({ period, setPeriod, years }: Props) => {
    return (
        <Select
            value={period.year.toString()}
            onValueChange={(val) =>
                setPeriod({ month: period.month, year: parseInt(val) })
            }
        >
            <SelectTrigger className="w-[180px] border border-neutral-200 bg-white text-neutral-500 shadow-[0px_1px_2px_0px_rgba(82,88,102,0.06)] hover:border-transparent hover:bg-neutral-100 hover:text-neutral-900 focus:border-neutral-900 focus:text-neutral-900 focus:ring-0 disabled:border-transparent">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                        {year}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};
