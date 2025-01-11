'use client';

import * as React from 'react';

import { updateUserCurrency } from '@/app/wizard/_actions/user-settings';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Currencies } from '@/constants/currencies';
import { useMediaQuery } from '@/hooks/use-media-query';
import { ICurrency } from '@/types/currency';
import { UserSettings } from '@prisma/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { SkeletonWrapper } from '../skeleton/skeleton-wrapper';

export function CurrencyCombobox() {
    const [open, setOpen] = React.useState(false);
    const isDesktop = useMediaQuery('(min-width: 768px)');
    const [selectedOption, setSelectedOption] = React.useState<ICurrency | null>(null);
    const [popoverWidth, setPopoverWidth] = React.useState<number | null>(null);
    const popoverRef = React.useRef<HTMLButtonElement>(null);

    React.useEffect(() => {
        if (open && popoverRef.current) {
            setPopoverWidth(popoverRef.current.offsetWidth);
        }
    }, [open]);

    const userSettings = useQuery<UserSettings>({
        queryKey: ['user-settings'],
        queryFn: () => fetch('/api/user-settings').then((res) => res.json()),
    });

    React.useEffect(() => {
        if (!userSettings.data) return;

        const userCurrency = Currencies.find(
            (item) => item.value === userSettings.data.currency
        );

        if (userCurrency) {
            setSelectedOption(userCurrency);
        }
    }, [userSettings.data]);

    const updateCurrency = useMutation({
        mutationFn: updateUserCurrency,
        onSuccess: (data: UserSettings) => {
            toast.success('Currency updated successfully 🎉', {
                id: 'update-currency',
            });

            setSelectedOption(
                Currencies.find((cur) => cur.value === data.currency) || null
            );
        },
        onError: (error) => {
            toast.error('Something went wrong', { id: 'update-currency' });
        },
    });

    const handleOptionSelect = React.useCallback(
        (currency: ICurrency | null) => {
            if (!currency) {
                toast.error('Please select a currency.');
                return;
            }

            toast.loading('Updating currency...', {
                id: 'update-currency',
            });

            updateCurrency.mutate(currency.value);
        },
        [updateCurrency]
    );

    if (isDesktop) {
        return (
            <SkeletonWrapper isLoading={userSettings.isFetching}>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            ref={popoverRef}
                            disabled={updateCurrency.isPending}
                            variant="outline"
                            className="w-full justify-start bg-card"
                        >
                            {selectedOption ? (
                                <>{selectedOption.label}</>
                            ) : (
                                <>Set Currency</>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        className="rounded-[12px] p-0"
                        style={{
                            width: popoverWidth || 'auto',
                        }}
                        align="start"
                    >
                        <OptionList
                            setOpen={setOpen}
                            setSelectedOption={handleOptionSelect}
                        />
                    </PopoverContent>
                </Popover>
            </SkeletonWrapper>
        );
    }

    return (
        <SkeletonWrapper isLoading={userSettings.isFetching}>
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>
                    <Button
                        disabled={updateCurrency.isPending}
                        variant="outline"
                        className="w-[150px] justify-start"
                    >
                        {selectedOption ? <>{selectedOption.label}</> : <>Set Currency</>}
                    </Button>
                </DrawerTrigger>
                <DrawerContent>
                    <div className="mt-4 border-t">
                        <OptionList
                            setOpen={setOpen}
                            setSelectedOption={handleOptionSelect}
                        />
                    </div>
                </DrawerContent>
            </Drawer>
        </SkeletonWrapper>
    );
}

function OptionList({
    setOpen,
    setSelectedOption,
}: {
    setOpen: (open: boolean) => void;
    setSelectedOption: (status: ICurrency | null) => void;
}) {
    return (
        <Command className="rounded-[12px]">
            <CommandInput placeholder="Filter currency..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                    {Currencies.map((currency: ICurrency) => (
                        <CommandItem
                            key={currency.value}
                            value={currency.value}
                            onSelect={(value) => {
                                setSelectedOption(
                                    Currencies.find(
                                        (priority) => priority.value === value
                                    ) || null
                                );
                                setOpen(false);
                            }}
                            className="cursor-pointer rounded-[8px]"
                        >
                            {currency.label}
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </Command>
    );
}
