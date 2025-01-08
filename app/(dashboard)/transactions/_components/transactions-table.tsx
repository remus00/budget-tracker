'use client';

import { dateToUTCDate } from '@/lib/helpers';
import { useQuery } from '@tanstack/react-query';
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { transactionsColumn } from './transactions-column';
import { SkeletonWrapper } from '@/components/skeleton/skeleton-wrapper';
import { useMemo, useState } from 'react';
import { GetTransactionsHistoryResponseType } from '@/app/api/transactions-history/route';
import { DataTableFacetedFilter } from '@/components/custom/data-table/data-table-faceted-filter';
import { DataTableViewOptions } from '@/components/custom/data-table/column-toggle';
import { DataTablePagination } from '@/components/custom/data-table/data-table-pagination';
import { Button } from '@/components/ui/button';

interface Props {
    from: Date;
    to: Date;
}

const emptyData: any[] = [];

export const TransactionsTable = ({ from, to }: Props) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const historyQuery = useQuery<GetTransactionsHistoryResponseType>({
        queryKey: ['transactions', from, to],
        queryFn: () =>
            fetch(
                `/api/transactions-history?from=${dateToUTCDate(from)}&to=${dateToUTCDate(to)}`
            ).then((res) => res.json()),
    });

    const table = useReactTable({
        data: historyQuery.data || emptyData,
        columns: transactionsColumn,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            sorting,
            columnFilters,
        },
    });

    const categoriesOptions = useMemo(() => {
        const categoriesMap = new Map();

        historyQuery.data?.forEach((tran) => {
            categoriesMap.set(tran.category, {
                value: tran.category,
                label: `${tran.categoryIcon} ${tran.category}`,
            });
        });

        const uniqueCategories = new Set(categoriesMap.values());

        return Array.from(uniqueCategories);
    }, [historyQuery.data]);

    return (
        <div className="w-full">
            <div className="flex flex-wrap items-end justify-between gap-2 py-4">
                <div className="flex items-center gap-2">
                    {table.getColumn('category') && (
                        <DataTableFacetedFilter
                            title="Category"
                            column={table.getColumn('category')}
                            options={categoriesOptions}
                        />
                    )}
                    {table.getColumn('category') && (
                        <DataTableFacetedFilter
                            title="Type"
                            column={table.getColumn('type')}
                            options={[
                                { label: 'Income', value: 'income' },
                                { label: 'Expense', value: 'expense' },
                            ]}
                        />
                    )}
                </div>

                <div className="flex flex-wrap gap-2">
                    <DataTableViewOptions table={table} />
                </div>
            </div>
            <SkeletonWrapper isLoading={historyQuery.isFetching}>
                <div className="mb-4 rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column.columnDef.header,
                                                          header.getContext()
                                                      )}
                                            </TableHead>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && 'selected'}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={transactionsColumn.length}
                                        className="h-24 text-center"
                                    >
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <DataTablePagination table={table} />
            </SkeletonWrapper>
        </div>
    );
};
