'use client';
import { GetTransactionsHistoryResponseType } from '@/app/api/transactions-history/route';
import { DataTableColumnHeader } from '@/components/custom/data-table/column-header';
import { RowActions } from '@/components/custom/data-table/row-actions';
import { cn } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';

export const transactionsColumn: ColumnDef<GetTransactionsHistoryResponseType[0]>[] = [
    {
        accessorKey: 'category',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Category" />
        ),
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
        cell: ({ row }) => {
            return (
                <div className="flex items-center gap-2 capitalize">
                    <span role="img">{row.original.categoryIcon}</span>
                    <p className="capitalize">{row.original.category}</p>
                </div>
            );
        },
    },
    {
        accessorKey: 'description',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Description" />
        ),
        cell: ({ row }) => {
            return <p className="capitalize">{row.original.description}</p>;
        },
    },
    {
        accessorKey: 'date',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
        cell: ({ row }) => {
            const date = new Date(row.original.date);
            const formattedDate = date.toLocaleString('en-US', {
                timeZone: 'UTC',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            });
            return <p className="text-muted-foreground">{formattedDate}</p>;
        },
    },
    {
        accessorKey: 'type',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
        cell: ({ row }) => {
            const type = row.original.type;

            return (
                <div
                    className={cn(
                        'rounded-lg p-2 text-center font-semibold capitalize',
                        type === 'income'
                            ? 'bg-emerald-400/10 text-emerald-500'
                            : 'bg-rose-400/10 text-rose-500'
                    )}
                >
                    {type}
                </div>
            );
        },
    },
    {
        accessorKey: 'amount',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Amout" />,
        cell: ({ row }) => {
            return (
                <p className="text-md rounded-lg bg-gray-400/5 p-2 text-center font-medium">
                    {row.original.amount}
                </p>
            );
        },
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            return <RowActions transaction={row.original} />;
        },
    },
];
