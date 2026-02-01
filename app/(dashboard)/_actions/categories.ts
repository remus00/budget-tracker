'use server';

import { db } from '@/lib/db';
import { category } from '@/db/schema';
import {
    CreateCategorySchema,
    CreateCategorySchemaType,
    deleteCategorySchema,
    DeleteCategorySchemaType,
} from '@/schema/categories-schema';
import { currentUser } from '@clerk/nextjs/server';
import { and, eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export async function createCategory(form: CreateCategorySchemaType) {
    const parsedBody = CreateCategorySchema.safeParse(form);

    if (!parsedBody.success) {
        throw new Error('Bad request');
    }

    const user = await currentUser();

    if (!user) redirect('/sign-in');

    const { name, icon, type } = parsedBody.data;

    const inserted = await db
        .insert(category)
        .values({
            userId: user.id,
            name,
            icon,
            type,
        })
        .returning();

    return inserted[0];
}

export async function deleteCategory(form: DeleteCategorySchemaType) {
    const parsedBody = deleteCategorySchema.safeParse(form);

    if (!parsedBody.success) {
        throw new Error('Bad request');
    }

    const user = await currentUser();

    if (!user) redirect('/sign-in');

    await db
        .delete(category)
        .where(
            and(
                eq(category.userId, user.id),
                eq(category.name, parsedBody.data.name),
                eq(category.type, parsedBody.data.type)
            )
        );
}
