import { GetCategoriesResponseType } from '@/app/api/stats/categories/route';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { TransactionType } from '@/types/transactions';

interface Props {
    formatter: Intl.NumberFormat;
    data: GetCategoriesResponseType;
    type: TransactionType;
}

export const CategoriesCard = ({ formatter, data, type }: Props) => {
    const filteredData = data.filter((item) => item.type === type);

    const totalAmount = filteredData.reduce(
        (acc, element) => acc + (element._sum?.amount || 0),
        0
    );

    return (
        <Card className="col-span-6 h-80 w-full">
            <CardHeader>
                <CardTitle className="grid grid-flow-row justify-between gap-4 text-muted-foreground md:grid-flow-col">
                    <span>
                        <span
                            className={cn(
                                'capitalize',
                                type === 'expense' ? 'text-rose-500' : 'text-emerald-500'
                            )}
                        >
                            {type}
                        </span>
                        &nbsp;by category
                    </span>
                </CardTitle>
            </CardHeader>

            <div className="flex items-center justify-between gap-2">
                {filteredData.length === 0 && (
                    <div className="flex h-60 w-full flex-col items-center justify-center">
                        No data for the selected period
                        <p className="text-sm text-muted-foreground">
                            Try selecting a different period or try adding a new {type}
                        </p>
                    </div>
                )}

                {filteredData.length > 0 && (
                    <ScrollArea className="h-60 w-full px-4">
                        <div className="flex w-full flex-col gap-4 p-4">
                            {filteredData.map((item, idx) => {
                                const amount = item._sum.amount || 0;
                                const percentage =
                                    (amount * 100) / (totalAmount || amount);

                                return (
                                    <div key={idx} className="flex flex-col gap-2">
                                        <div className="flex items-center justify-between">
                                            <span className="flex items-center text-gray-400">
                                                {item.categoryIcon} {item.category}
                                                <span className="ml-2 text-xs text-muted-foreground">
                                                    ({percentage.toFixed(0)}%)
                                                </span>
                                            </span>

                                            <span className="text-sm text-gray-400">
                                                {formatter.format(amount)}
                                            </span>
                                        </div>

                                        <Progress
                                            value={percentage}
                                            indicator={
                                                type === 'expense'
                                                    ? 'bg-rose-500'
                                                    : 'bg-emerald-500'
                                            }
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </ScrollArea>
                )}
            </div>
        </Card>
    );
};
