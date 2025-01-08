'use client';

import { GetTransactionsHistoryResponseType } from '@/app/api/transactions-history/route';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Trash } from 'lucide-react';
import { useState } from 'react';
import { DeleteTransactionDialog } from '../transactions/delete-transaction-dialog';

interface Props {
    transaction: GetTransactionsHistoryResponseType[0];
}

export const RowActions = ({ transaction }: Props) => {
    const [showDialog, setShowDialog] = useState<boolean>(false);

    return (
        <div className="ml-auto flex w-fit items-center justify-end">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="ml-auto size-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="!size-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="flex cursor-pointer items-center justify-center gap-2 hover:!bg-rose-400/10"
                        onClick={() => setShowDialog((prev) => !prev)}
                    >
                        <Trash className="!size-4 text-muted-foreground" /> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <DeleteTransactionDialog
                open={showDialog}
                setOpen={setShowDialog}
                transactionId={transaction.id}
            />
        </div>
    );
};
