import { db } from '@/lib/db';
import { category } from '@/db/schema';
import { currentUser } from '@clerk/nextjs/server';
import { and, eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { z } from 'zod';

export async function GET(request: Request) {
    const user = await currentUser();

    if (!user) redirect('/sign-in');

    const { searchParams } = new URL(request.url);
    const paramType = searchParams.get('type');
    const validator = z.enum(['expense', 'income']).nullable();
    const queryParam = validator.safeParse(paramType);

    if (!queryParam.success) {
        return Response.json(queryParam.error, { status: 400 });
    }

    const type = queryParam.data;

    const categories = await db
        .select()
        .from(category)
        .where(
            type
                ? and(eq(category.userId, user.id), eq(category.type, type))
                : eq(category.userId, user.id)
        )
        .orderBy(category.name);

    return Response.json(categories);
}
