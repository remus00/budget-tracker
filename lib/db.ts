import * as schema from '@/db/schema';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

function getConnectionString(): string {
    const url = process.env.DATABASE_URL ?? '';
    if (!url) return url;

    if (/[?&]sslmode=/.test(url)) {
        return url.replace(/sslmode=[^&]+/, 'sslmode=verify-full');
    }
    return url.includes('?')
        ? `${url}&sslmode=verify-full`
        : `${url}?sslmode=verify-full`;
}

const pool = new Pool({
    connectionString: getConnectionString(),
});

export const db = drizzle(pool, { schema });
