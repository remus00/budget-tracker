'use server';
import { db } from '@/lib/prisma';
import {
    CreateCategorySchema,
    CreateCategorySchemaType,
} from '@/schema/categories-schema';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export async function createCategory(form: CreateCategorySchemaType) {
    const parsedBody = CreateCategorySchema.safeParse(form);

    if (!parsedBody.success) {
        throw new Error('Bad request');
    }

    const user = await currentUser();

    if (!user) redirect('/sign-in');

    const { name, icon, type } = parsedBody.data;

    return await db.category.create({
        data: {
            userId: user.id,
            name,
            icon,
            type,
        },
    });
}
