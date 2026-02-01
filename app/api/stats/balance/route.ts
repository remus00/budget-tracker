import { db } from '@/lib/db';
import { transaction } from '@/db/schema';
import { OverviewQuerySchema } from '@/schema/overview-schema';
import { currentUser } from '@clerk/nextjs/server';
import { and, eq, gte, lte, sql } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
    const user = await currentUser();

    if (!user) redirect('/sign-in');

    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    const queryParams = OverviewQuerySchema.safeParse({ from, to });

    if (!queryParams.success) {
        return Response.json(queryParams.error.message, { status: 400 });
    }

    const stats = await getBalanceData(
        user.id,
        queryParams.data.from,
        queryParams.data.to
    );

    return Response.json(stats);
}

const getBalanceData = async (userId: string, from: Date, to: Date) => {
    const totals = await db
        .select({
            type: transaction.type,
            sum: sql<number>`coalesce(sum(${transaction.amount})::double precision, 0)`,
        })
        .from(transaction)
        .where(
            and(
                eq(transaction.userId, userId),
                gte(transaction.date, from),
                lte(transaction.date, to)
            )
        )
        .groupBy(transaction.type);

    return {
        expense:
            Number(
                totals.find((t) => t.type === 'expense')?.sum ?? 0
            ),
        income: Number(totals.find((t) => t.type === 'income')?.sum ?? 0),
    };
};

export type GetBalanceResponseType = Awaited<ReturnType<typeof getBalanceData>>;
