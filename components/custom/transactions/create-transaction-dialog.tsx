'use client';
import { createTransaction } from '@/app/(dashboard)/_actions/transactions';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { dateToUTCDate } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import {
    CreateTransactionSchema,
    CreateTransactionSchemaType,
} from '@/schema/transaction-schema';
import { TransactionType } from '@/types/transactions';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { ReactNode, useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { CategoryPicker } from './category-picker';

interface Props {
    trigger: ReactNode;
    type: TransactionType;
}

export const CreateTransactionDialog = ({ trigger, type }: Props) => {
    const [open, setOpen] = useState<boolean>(false);

    const form = useForm<CreateTransactionSchemaType>({
        resolver: zodResolver(CreateTransactionSchema),
        defaultValues: {
            type: type,
            description: '',
            amount: 0,
            date: new Date(),
        },
    });

    const handleCategoryChange = useCallback(
        (val: string) => {
            form.setValue('category', val);
        },
        [form]
    );

    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: createTransaction,
        onSuccess: async () => {
            toast.success('Transaction created successfully 🎉', {
                id: 'create-transaction',
            });
            form.reset({
                type,
                description: '',
                amount: 0,
                date: new Date(),
                category: undefined,
            });

            await queryClient.invalidateQueries({
                queryKey: ['overview'],
            });

            setOpen((prev) => !prev);
        },
    });

    const onSubmit = useCallback(
        (values: CreateTransactionSchemaType) => {
            toast.loading('Creating transaction...', { id: 'create-transaction' });
            mutate({ ...values, date: dateToUTCDate(values.date) });
        },
        [mutate]
    );

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Create a new{' '}
                        <span
                            className={cn(
                                'capitalize',
                                type === 'income' ? 'text-emerald-500' : 'text-rose-500'
                            )}
                        >
                            {type}
                        </span>
                        &nbsp;transaction
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form className="space-y-4">
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Transaction description (optional)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount</FormLabel>
                                    <FormControl>
                                        <Input type="tel" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Transaction amount (required)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 items-start justify-center gap-4">
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <FormControl>
                                            <CategoryPicker
                                                type={type}
                                                onChange={handleCategoryChange}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Select a category for this transaction
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Transaction date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            'w-[200px] pl-3 text-left font-normal',
                                                            !field.value &&
                                                                'text-muted-foreground'
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, 'PPP')
                                                        ) : (
                                                            <span>Select the date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto size-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    initialFocus={true}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormDescription>
                                            Select a date for this transaction
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </form>
                </Form>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => form.reset()}
                        >
                            Close
                        </Button>
                    </DialogClose>

                    <DialogClose asChild>
                        <Button
                            disabled={isPending}
                            onClick={form.handleSubmit(onSubmit)}
                        >
                            {!isPending ? 'Create' : <Loader2 className="animate-spin" />}
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
