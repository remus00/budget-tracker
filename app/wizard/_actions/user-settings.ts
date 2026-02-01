'use server';

import { db } from '@/lib/db';
import { userSettings } from '@/db/schema';
import { UpdateUserCurrencySchema } from '@/schema/user-settings-schema';
import { currentUser } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export async function updateUserCurrency(currency: string) {
    const parsedBody = UpdateUserCurrencySchema.safeParse({ currency });

    if (!parsedBody.success) {
        throw parsedBody.error;
    }

    const user = await currentUser();

    if (!user) redirect('/sign-in');

    const updated = await db
        .update(userSettings)
        .set({ currency })
        .where(eq(userSettings.userId, user.id))
        .returning();

    return updated[0];
}
