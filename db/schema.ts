import {
    decimal,
    integer,
    pgTable,
    primaryKey,
    text,
    timestamp,
    unique,
    uuid,
} from 'drizzle-orm/pg-core';

export const userSettings = pgTable('UserSettings', {
    userId: text('userId').primaryKey(),
    currency: text('currency').notNull(),
});

export const category = pgTable(
    'Category',
    {
        createdAt: timestamp('createdAt', { withTimezone: true })
            .defaultNow()
            .notNull(),
        name: text('name').notNull(),
        userId: text('userId').notNull(),
        icon: text('icon').notNull(),
        type: text('type').default('income').notNull(),
    },
    (t) => [
        unique('Category_name_userId_type_key').on(t.name, t.userId, t.type),
    ]
);

export const transaction = pgTable('Transaction', {
    id: uuid('id').defaultRandom().primaryKey(),
    createdAt: timestamp('createdAt', { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: timestamp('updatedAt', { withTimezone: true })
        .defaultNow()
        .notNull(),
    amount: decimal('amount', { precision: 19, scale: 4 }).notNull(),
    description: text('description').notNull(),
    date: timestamp('date', { withTimezone: true }).notNull(),
    userId: text('userId').notNull(),
    type: text('type').default('income').notNull(),
    category: text('category').notNull(),
    categoryIcon: text('categoryIcon').notNull(),
});

export const monthHistory = pgTable(
    'MonthHistory',
    {
        userId: text('userId').notNull(),
        day: integer('day').notNull(),
        month: integer('month').notNull(),
        year: integer('year').notNull(),
        income: decimal('income', { precision: 19, scale: 4 }).notNull(),
        expense: decimal('expense', { precision: 19, scale: 4 }).notNull(),
    },
    (t) => [
        primaryKey({
            columns: [t.day, t.month, t.year, t.userId],
            name: 'MonthHistory_day_month_year_userId_pkey',
        }),
    ]
);

export const yearHistory = pgTable(
    'YearHistory',
    {
        userId: text('userId').notNull(),
        month: integer('month').notNull(),
        year: integer('year').notNull(),
        income: decimal('income', { precision: 19, scale: 4 }).notNull(),
        expense: decimal('expense', { precision: 19, scale: 4 }).notNull(),
    },
    (t) => [
        primaryKey({
            columns: [t.month, t.year, t.userId],
            name: 'YearHistory_month_year_userId_pkey',
        }),
    ]
);

// Inferred types for components
export type UserSettings = typeof userSettings.$inferSelect;
export type Category = typeof category.$inferSelect;
export type Transaction = typeof transaction.$inferSelect;
export type MonthHistory = typeof monthHistory.$inferSelect;
export type YearHistory = typeof yearHistory.$inferSelect;
