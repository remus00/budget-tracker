export type TimeFrame = 'month' | 'year';

export type Period = { year: number; month: number };

export type HistoryData = {
    expense: number;
    income: number;
    year: number;
    month: number;
    day?: number;
};
