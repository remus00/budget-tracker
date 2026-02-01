import { getFormatterForCurrency } from '@/lib/helpers';
import { db } from '@/lib/db';
import { transaction, userSettings } from '@/db/schema';
import { OverviewQuerySchema } from '@/schema/overview-schema';
import { currentUser } from '@clerk/nextjs/server';
import { and, desc, eq, gte, lte } from 'drizzle-orm';
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

    const transactions = await getTransactionHistory(
        user.id,
        queryParams.data.from,
        queryParams.data.to
    );

    return Response.json(transactions);
}

const getTransactionHistory = async (userId: string, from: Date, to: Date) => {
    const settingsRows = await db
        .select()
        .from(userSettings)
        .where(eq(userSettings.userId, userId))
        .limit(1);

    const userSettingsRow = settingsRows[0];
    if (!userSettingsRow) {
        throw new Error('User settings not found');
    }

    const formatter = getFormatterForCurrency(userSettingsRow.currency);

    const transactions = await db
        .select()
        .from(transaction)
        .where(
            and(
                eq(transaction.userId, userId),
                gte(transaction.date, from),
                lte(transaction.date, to)
            )
        )
        .orderBy(desc(transaction.date));

    return transactions.map((tran) => ({
        ...tran,
        amount: Number(tran.amount),
        formattedAmount: formatter.format(Number(tran.amount)),
    }));
};

export type GetTransactionsHistoryResponseType = Awaited<
    ReturnType<typeof getTransactionHistory>
>;
