import { db } from '@/lib/db';
import { monthHistory } from '@/db/schema';
import { currentUser } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { asc } from 'drizzle-orm';

export async function GET(request: Request) {
    const user = await currentUser();

    if (!user) redirect('/sign-in');

    const periods = await getHistoryPeriods(user.id);

    return Response.json(periods);
}

const getHistoryPeriods = async (userId: string) => {
    const result = await db
        .selectDistinct({ year: monthHistory.year })
        .from(monthHistory)
        .where(eq(monthHistory.userId, userId))
        .orderBy(asc(monthHistory.year));

    const years = result.map((el) => el.year);

    if (years.length === 0) {
        return [new Date().getFullYear()];
    }

    return years;
};

export type GetHistoryPeriodsResponseType = Awaited<
    ReturnType<typeof getHistoryPeriods>
>;
