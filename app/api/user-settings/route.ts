import { db } from '@/lib/db';
import { userSettings } from '@/db/schema';
import { currentUser } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
    const user = await currentUser();

    if (!user) redirect('/sign-in');

    let userSettingsRows = await db
        .select()
        .from(userSettings)
        .where(eq(userSettings.userId, user.id))
        .limit(1);

    let userSettingsRow = userSettingsRows[0];

    if (!userSettingsRow) {
        const inserted = await db
            .insert(userSettings)
            .values({ userId: user.id, currency: 'USD' })
            .returning();
        userSettingsRow = inserted[0];
    }

    revalidatePath('/');
    return Response.json(userSettingsRow);
}
