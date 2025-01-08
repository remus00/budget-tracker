'use client';

import { deleteTransaction } from '@/app/(dashboard)/_actions/transactions';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dispatch, SetStateAction } from 'react';
import { toast } from 'sonner';

interface Props {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    transactionId: string;
}

export const DeleteTransactionDialog = ({ open, setOpen, transactionId }: Props) => {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: deleteTransaction,
        onSuccess: async () => {
            toast.success('Transaction deleted successfully', { id: transactionId });

            await queryClient.invalidateQueries({ queryKey: ['transactions'] });
        },
        onError: () => {
            toast.error('Something went wrong', { id: transactionId });
        },
    });

    const handleDeleteClick = () => {
        toast.loading('Deleting transaction...', { id: transactionId });

        mutate(transactionId);
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This action will permanently delete
                        this transaction.
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
