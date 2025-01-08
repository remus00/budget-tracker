'use client';

import { GetTransactionsHistoryResponseType } from '@/app/api/transactions-history/route';
import { DataTableViewOptions } from '@/components/custom/data-table/column-toggle';
import { DataTableFacetedFilter } from '@/components/custom/data-table/data-table-faceted-filter';
import { DataTablePagination } from '@/components/custom/data-table/data-table-pagination';
import { SkeletonWrapper } from '@/components/skeleton/skeleton-wrapper';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { dateToUTCDate } from '@/lib/helpers';
import { useQuery } from '@tanstack/react-query';
import {
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import { Download } from 'lucide-react';
import { useMemo, useState } from 'react';
import { transactionsColumn } from './transactions-column';

interface Props {
    from: Date;
    to: Date;
}

const emptyData: any[] = [];

const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
});

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

    const handleExportCsv = (data: any[]) => {
        const csv = generateCsv(csvConfig)(data);
        download(csvConfig)(csv);
    };

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
                    <Button
                        variant="outline"
                        className="ml-auto h-8 lg:flex"
                        onClick={() => {
                            const data = table.getFilteredRowModel().rows.map((row) => ({
                                category: row.original.category,
                                categoryIcon: row.original.categoryIcon,
                                description: row.original.description,
                                type: row.original.type,
                                amount: row.original.amount,
                                formattedAmount: row.original.formattedAmount,
                                date: row.original.date,
                            }));
                            handleExportCsv(data);
                        }}
                    >
                        <Download className="mr-2 !size-4" />
                        Export csv
                    </Button>
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
