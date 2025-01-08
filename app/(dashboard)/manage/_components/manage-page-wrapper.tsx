'use client';

import { CurrencyCombobox } from '@/components/custom/currency-combobox';
import { CategoryList } from '@/components/custom/manage/category-list';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export const ManagePageWrapper = () => {
    return (
        <>
            <div className="border-b bg-card">
                <div className="container mx-auto flex flex-wrap items-center justify-between gap-6 px-8 py-8">
                    <div className="">
                        <p className="text-3xl font-bold">Manage</p>
                        <p className="text-muted-foreground">
                            Manage your account and categories
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto flex flex-col gap-4 px-8 py-4">
                <Card className="w-full shrink-0 md:max-w-[350px]">
                    <CardHeader>
                        <CardTitle>Currency</CardTitle>
                        <CardDescription>
                            Se your default currency for each transaction
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CurrencyCombobox />
                    </CardContent>
                </Card>

                <CategoryList type="income" />
                <CategoryList type="expense" />
            </div>
        </>
    );
};
