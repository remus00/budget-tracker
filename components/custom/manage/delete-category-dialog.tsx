'use client';

import { deleteCategory } from '@/app/(dashboard)/_actions/categories';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { TransactionType } from '@/types/transactions';
import { Category } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { toast } from 'sonner';

interface Props {
    trigger: ReactNode;
    category: Category;
}

export const DeleteCategoryDialog = ({ trigger, category }: Props) => {
    const categoryToastId = `${category.name}-${category.type}`;

    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: deleteCategory,
        onSuccess: async () => {
            toast.success('Category deleted successfully', { id: categoryToastId });

            await queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
        onError: () => {
            toast.error('Something went wrong', { id: categoryToastId });
        },
    });

    const handleDeleteClick = () => {
        toast.loading('Deleting category...', { id: categoryToastId });

        mutate({
            name: category.name,
            type: category.type as TransactionType,
        });
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This action will permanently delete
                        this category.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteClick}>
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
