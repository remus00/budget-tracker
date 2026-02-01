import { db } from '@/lib/db';
import { transaction } from '@/db/schema';
import { OverviewQuerySchema } from '@/schema/overview-schema';
import { currentUser } from '@clerk/nextjs/server';
import { and, desc, eq, gte, lte, sql } from 'drizzle-orm';
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

    const stats = await getCategoriesStats(
        user.id,
        queryParams.data.from,
        queryParams.data.to
    );

    return Response.json(stats);
}

const getCategoriesStats = async (userId: string, from: Date, to: Date) => {
    const rows = await db
        .select({
            type: transaction.type,
            category: transaction.category,
            categoryIcon: transaction.categoryIcon,
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
        .groupBy(
            transaction.type,
            transaction.category,
            transaction.categoryIcon
        )
        .orderBy(desc(sql`sum(${transaction.amount})`));

    return rows.map((r) => ({
        type: r.type,
        category: r.category,
        categoryIcon: r.categoryIcon,
        _sum: { amount: Number(r.sum) },
    }));
};

export type GetCategoriesResponseType = Awaited<ReturnType<typeof getCategoriesStats>>;
