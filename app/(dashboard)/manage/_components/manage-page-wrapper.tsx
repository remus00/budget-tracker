'use client';

import { CurrencyCombobox } from '@/components/custom/currency-combobox';
import { CategoryList } from '@/components/custom/manage/category-list';
import { Navbar } from '@/components/custom/navbar/navbar';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export const ManagePageWrapper = () => {
    return (
        <div className="mb-4">
            <Navbar
                label="Manage"
                description="Manage your account and categories"
                icon="lucide:settings-2"
            />

            <div className="mb-4 mt-4 flex flex-col gap-4">
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
        </div>
    );
};
