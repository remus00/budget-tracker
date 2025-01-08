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
            <SelectTrigger className="w-[180px]">
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
