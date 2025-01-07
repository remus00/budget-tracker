'use client';
import { Command, CommandInput } from '@/components/ui/command';
import { TransactionType } from '@/types/transactions';
import { Category } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Button } from '../../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { CategoryRow } from './category-row';
import { CreateCategoryDialog } from './create-category-dialog';

export const CategoryPicker = ({ type }: { type: TransactionType }) => {
    const [open, setOpen] = useState<boolean>(false);
    const [value, setValue] = useState<string>('');

    const categoriesQuery = useQuery({
        queryKey: ['categories', type],
        queryFn: () => fetch(`/api/categories?type=${type}`).then((res) => res.json()),
    });

    const selectedCategory = categoriesQuery.data?.find(
        (cat: Category) => cat.name === value
    );
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="flex w-[200px] justify-between"
                >
                    {selectedCategory ? (
                        <CategoryRow category={selectedCategory} />
                    ) : (
                        'Select a category'
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command onSubmit={(e) => e.preventDefault()}>
                    <CommandInput placeholder="Search a category" />
                    <CreateCategoryDialog type={type} />
                </Command>
            </PopoverContent>
        </Popover>
    );
};
