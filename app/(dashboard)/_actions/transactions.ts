'use server';

import { category, monthHistory, transaction, yearHistory } from '@/db/schema';
import { db } from '@/lib/db';
import {
    CreateTransactionSchema,
    CreateTransactionSchemaType,
} from '@/schema/transaction-schema';
import { currentUser } from '@clerk/nextjs/server';
import { and, eq, sql } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { randomUUID } from 'node:crypto';

export async function createTransaction(form: CreateTransactionSchemaType) {
    const parsedBody = CreateTransactionSchema.safeParse(form);

    if (!parsedBody.success) {
        throw new Error('Bad request');
    }

    const user = await currentUser();

    if (!user) redirect('/sign-in');

    const { amount, category: categoryName, date, description, type } = parsedBody.data;

    const categoryRows = await db
        .select()
        .from(category)
        .where(
            and(
                eq(category.userId, user.id),
                eq(category.name, categoryName),
                eq(category.type, type)
            )
        )
        .limit(1);

    const categoryRow = categoryRows[0];

    if (!categoryRow) {
        throw new Error('Category not found');
    }

    const day = date.getUTCDate();
    const month = date.getUTCMonth();
    const year = date.getUTCFullYear();

    await db.transaction(async (tx) => {
        await tx.insert(transaction).values({
            id: randomUUID(),
            userId: user.id,
            amount: String(amount),
            date,
            description: description ?? '',
            type,
            category: categoryRow.name,
            categoryIcon: categoryRow.icon,
        });

        await tx
            .insert(monthHistory)
            .values({
                userId: user.id,
                day,
                month,
                year,
                expense: type === 'expense' ? String(amount) : '0',
                income: type === 'income' ? String(amount) : '0',
            })
            .onConflictDoUpdate({
                target: [
                    monthHistory.day,
                    monthHistory.month,
                    monthHistory.year,
                    monthHistory.userId,
                ],
                set: {
                    expense: sql`${monthHistory.expense} + ${type === 'expense' ? amount : 0}`,
                    income: sql`${monthHistory.income} + ${type === 'income' ? amount : 0}`,
                },
            });

        await tx
            .insert(yearHistory)
            .values({
                userId: user.id,
                month,
                year,
                expense: type === 'expense' ? String(amount) : '0',
                income: type === 'income' ? String(amount) : '0',
            })
            .onConflictDoUpdate({
                target: [yearHistory.month, yearHistory.year, yearHistory.userId],
                set: {
                    expense: sql`${yearHistory.expense} + ${type === 'expense' ? amount : 0}`,
                    income: sql`${yearHistory.income} + ${type === 'income' ? amount : 0}`,
                },
            });
    });
}

export async function deleteTransaction(id: string) {
    const user = await currentUser();

    if (!user) redirect('/sign-in');

    const txRows = await db
        .select()
        .from(transaction)
        .where(and(eq(transaction.userId, user.id), eq(transaction.id, id)))
        .limit(1);

    const txRow = txRows[0];

    if (!txRow) {
        throw new Error('Bad request');
    }

    const day = new Date(txRow.date).getUTCDate();
    const month = new Date(txRow.date).getUTCMonth();
    const year = new Date(txRow.date).getUTCFullYear();
    const amount = Number(txRow.amount);

    await db.transaction(async (tx) => {
        await tx
            .delete(transaction)
            .where(and(eq(transaction.userId, user.id), eq(transaction.id, id)));

        await tx
            .update(monthHistory)
            .set({
                expense: sql`${monthHistory.expense} - ${txRow.type === 'expense' ? amount : 0}`,
                income: sql`${monthHistory.income} - ${txRow.type === 'income' ? amount : 0}`,
            })
            .where(
                and(
                    eq(monthHistory.userId, user.id),
                    eq(monthHistory.day, day),
                    eq(monthHistory.month, month),
                    eq(monthHistory.year, year)
                )
            );

        await tx
            .update(yearHistory)
            .set({
                expense: sql`${yearHistory.expense} - ${txRow.type === 'expense' ? amount : 0}`,
                income: sql`${yearHistory.income} - ${txRow.type === 'income' ? amount : 0}`,
            })
            .where(
                and(
                    eq(yearHistory.userId, user.id),
                    eq(yearHistory.month, month),
                    eq(yearHistory.year, year)
                )
            );
    });
}
