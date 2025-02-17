'use client';
import { createCategory } from '@/app/(dashboard)/_actions/categories';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
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
import { cn } from '@/lib/utils';
import {
    CreateCategorySchema,
    CreateCategorySchemaType,
} from '@/schema/categories-schema';
import { TransactionType } from '@/types/transactions';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Category } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CircleOff, Loader2, PlusSquare } from 'lucide-react';
import { useTheme } from 'next-themes';
import { ReactNode, useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface Props {
    successCallback: (category: Category) => void;
    type: TransactionType;
    trigger?: ReactNode;
}

export const CreateCategoryDialog = ({ type, successCallback, trigger }: Props) => {
    const [open, setOpen] = useState<boolean>(false);

    const queryClient = useQueryClient();
    const theme = useTheme();

    const form = useForm<CreateCategorySchemaType>({
        resolver: zodResolver(CreateCategorySchema),
        defaultValues: {
            name: '',
            icon: '',
            type: type,
        },
    });

    const { mutate, isPending } = useMutation({
        mutationFn: createCategory,
        onSuccess: async (data: Category) => {
            form.reset({ name: '', icon: '', type });
            toast.success(`Category ${data.name} created successfully 🎉`, {
                id: 'create-category',
            });

            successCallback(data);

            await queryClient.invalidateQueries({
                queryKey: ['categories'],
            });

            setOpen((prev) => !prev);
        },
        onError: () => {
            toast.error('Something went wrong', {
                id: 'create-category',
            });
        },
    });

    const onSubmit = useCallback(
        (values: CreateCategorySchemaType) => {
            toast.loading('Creating categories...', { id: 'create-category' });
            mutate(values);
        },
        [mutate]
    );

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger ? (
                    trigger
                ) : (
                    <Button
                        variant="ghost"
                        className="flex border-separate justify-start rounded-none border-b p-3 text-muted-foreground"
                    >
                        <PlusSquare className="size-4" />
                        Create new
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Create{' '}
                        <span
                            className={cn(
                                'capitalize',
                                type === 'income' ? 'text-emerald-500' : 'text-rose-500'
                            )}
                        >
                            {type}
                        </span>
                        &nbsp;category
                    </DialogTitle>
                    <DialogDescription>
                        Categories are used to group your transactions
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormDescription>Category name</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="icon"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Icon</FormLabel>
                                    <FormControl>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="h-[100px] w-full"
                                                >
                                                    {form.watch('icon') ? (
                                                        <div className="flex flex-col items-center gap-2">
                                                            <span
                                                                role="img"
                                                                className="text-5xl"
                                                            >
                                                                {field.value}
                                                            </span>
                                                            <p className="text-xs text-muted-foreground">
                                                                Click to change
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center gap-2">
                                                            <CircleOff className="!size-[48px]" />
                                                            <p className="text-xs text-muted-foreground">
                                                                Click to select
                                                            </p>
                                                        </div>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-full">
                                                <Picker
                                                    data={data}
                                                    onEmojiSelect={(emoji: {
                                                        native: string;
                                                    }) => field.onChange(emoji.native)}
                                                    theme={theme.resolvedTheme}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </FormControl>
                                    <FormDescription>
                                        This is how your category will appear
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
