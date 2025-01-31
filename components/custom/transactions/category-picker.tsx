'use client';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { TransactionType } from '@/types/transactions';
import { Category } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '../../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { CategoryRow } from './category-row';
import { CreateCategoryDialog } from './create-category-dialog';

interface Props {
    type: TransactionType;
    onChange: (val: string) => void;
}

export const CategoryPicker = ({ type, onChange }: Props) => {
    const [open, setOpen] = useState<boolean>(false);
    const [value, setValue] = useState<string>('');

    useEffect(() => {
        if (!value) return;
        onChange(value);
    }, [onChange, value]);

    const categoriesQuery = useQuery({
        queryKey: ['categories', type],
        queryFn: () => fetch(`/api/categories?type=${type}`).then((res) => res.json()),
    });

    const selectedCategory = categoriesQuery.data?.find(
        (cat: Category) => cat.name === value
    );

    const successCallback = useCallback(
        (category: Category) => {
            setValue(category.name);
            setOpen((prev) => !prev);
        },
        [setValue, setOpen]
    );

    return (
        <Popover open={open} onOpenChange={setOpen} modal={true}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="flex w-full justify-between sm:w-[200px]"
                >
                    {selectedCategory ? (
                        <CategoryRow category={selectedCategory} />
                    ) : (
                        'Select a category'
                    )}
                    <ChevronsUpDown className="ml-auto size-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command onSubmit={(e) => e.preventDefault()}>
                    <CommandInput placeholder="Search a category" />
                    <CreateCategoryDialog type={type} successCallback={successCallback} />
                    <CommandEmpty>
                        <p className="">Category not found</p>
                        <p className="text-xs text-muted-foreground">
                            Tip: Create a new category
                        </p>
                    </CommandEmpty>

                    <CommandGroup>
                        <CommandList>
                            {categoriesQuery.data &&
                                categoriesQuery.data.map((cat: Category, idx: number) => (
                                    <CommandItem
                                        key={idx}
                                        onSelect={() => {
                                            setValue(cat.name);
                                            setOpen((prev) => !prev);
                                        }}
                                        className="cursor-pointer"
                                    >
                                        <CategoryRow category={cat} />
                                        <Check
                                            className={cn(
                                                'ml-auto !size-4 opacity-0',
                                                value === cat.name && 'opacity-100'
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                        </CommandList>
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
};
