import { getFormatterForCurrency } from '@/lib/helpers';
import { db } from '@/lib/prisma';
import { OverviewQuerySchema } from '@/schema/overview-schema';
import { currentUser } from '@clerk/nextjs/server';
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
    const userSettings = await db.userSettings.findUnique({
        where: { userId },
    });

    if (!userSettings) {
        throw new Error('User settings not found');
    }

    const formatter = getFormatterForCurrency(userSettings.currency);

    const transactions = await db.transaction.findMany({
        where: {
            userId,
            date: {
                gte: from,
                lte: to,
            },
        },
        orderBy: { date: 'desc' },
    });

    return transactions.map((tran) => ({
        ...tran,
        formattedAmount: formatter.format(tran.amount),
    }));
};

export type GetTransactionsHistoryResponseType = Awaited<
    ReturnType<typeof getTransactionHistory>
>;
