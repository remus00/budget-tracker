import { db } from '@/lib/db';
import { monthHistory, yearHistory } from '@/db/schema';
import { getHistoryDataSchema } from '@/schema/history-data-schema';
import { HistoryData, Period, TimeFrame } from '@/types/history';
import { currentUser } from '@clerk/nextjs/server';
import { and, eq } from 'drizzle-orm';
import { getDaysInMonth } from 'date-fns';
import { redirect } from 'next/navigation';
import { asc } from 'drizzle-orm';

export async function GET(request: Request) {
    const user = await currentUser();

    if (!user) redirect('/sign-in');

    const { searchParams } = new URL(request.url);
    const timeFrame = searchParams.get('timeFrame');
    const year = searchParams.get('year');
    const month = searchParams.get('month');

    const queryParams = getHistoryDataSchema.safeParse({
        timeFrame,
        month,
        year,
    });

    if (!queryParams.success) {
        return Response.json(queryParams.error.message, { status: 400 });
    }

    const data = await getHistoryData(user.id, queryParams.data.timeFrame, {
        month: queryParams.data.month,
        year: queryParams.data.year,
    });

    return Response.json(data);
}

const getHistoryData = async (
    userId: string,
    timeFrame: TimeFrame,
    period: Period
) => {
    switch (timeFrame) {
        case 'year':
            return await getYearHistoryData(userId, period.year);
        case 'month':
            return await getMonthHistoryData(
                userId,
                period.year,
                period.month
            );
    }
};

const getYearHistoryData = async (userId: string, year: number) => {
    const result = await db
        .select()
        .from(yearHistory)
        .where(and(eq(yearHistory.userId, userId), eq(yearHistory.year, year)))
        .orderBy(asc(yearHistory.month));

    if (!result || result.length === 0) return [];

    const history: HistoryData[] = [];

    for (let i = 0; i < 12; i++) {
        const row = result.find((r) => r.month === i);
        history.push({
            year,
            month: i,
            expense: row ? Number(row.expense) : 0,
            income: row ? Number(row.income) : 0,
        });
    }

    return history;
};

const getMonthHistoryData = async (
    userId: string,
    year: number,
    month: number
) => {
    const result = await db
        .select()
        .from(monthHistory)
        .where(
            and(
                eq(monthHistory.userId, userId),
                eq(monthHistory.year, year),
                eq(monthHistory.month, month)
            )
        )
        .orderBy(asc(monthHistory.day));

    if (!result || result.length === 0) return [];

    const history: HistoryData[] = [];
    const daysInMonth = getDaysInMonth(new Date(year, month));

    for (let i = 1; i <= daysInMonth; i++) {
        const row = result.find((r) => r.day === i);
        history.push({
            year,
            month,
            expense: row ? Number(row.expense) : 0,
            income: row ? Number(row.income) : 0,
            day: i,
        });
    }

    return history;
};

export type GetHistoryDataResponseType = Awaited<
    ReturnType<typeof getHistoryData>
>;
