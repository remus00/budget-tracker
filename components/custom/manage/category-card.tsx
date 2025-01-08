import { Button } from '@/components/ui/button';
import { Category } from '@prisma/client';
import { Trash } from 'lucide-react';

export const CategoryCard = ({ category }: { category: Category }) => {
    return (
        <div className="flex border-separate flex-col justify-between rounded-md border shadow-md shadow-black/[0.1] dark:shadow-white/[0.1]">
            <div className="flex flex-col items-center gap-2 p-4">
                <span className="text-3xl" role="img">
                    {category.icon}
                </span>
                <p>{category.name}</p>
            </div>

            <Button
                variant="secondary"
                className="flex w-full border-separate items-center gap-2 rounded-t-none border text-muted-foreground hover:bg-red-500/20"
            >
                <Trash className="!size-4" />
                Remove
            </Button>
        </div>
    );
};
