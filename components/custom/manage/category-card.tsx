import { Button } from '@/components/ui/button';
import { Category } from '@prisma/client';
import { Trash } from 'lucide-react';
import { DeleteCategoryDialog } from './delete-category-dialog';

export const CategoryCard = ({ category }: { category: Category }) => {
    return (
        <div className="flex border-separate flex-col justify-between overflow-hidden rounded-[12px] border shadow-md shadow-black/[0.1] dark:shadow-white/[0.1]">
            <div className="flex flex-col items-center gap-2 p-4">
                <span className="text-3xl" role="img">
                    {category.icon}
                </span>
                <p>{category.name}</p>
            </div>

            <DeleteCategoryDialog
                category={category}
                trigger={
                    <Button
                        variant="secondary"
                        className="flex w-full border-separate items-center gap-2 rounded-none border-x-0 border-b-0 border-t text-muted-foreground hover:bg-red-500/20 hover:text-red-500"
                    >
                        <Trash className="!size-4" />
                        Remove
                    </Button>
                }
            />
        </div>
    );
};
