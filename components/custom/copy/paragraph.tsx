import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const paragraphVariants = cva('font-normal text-wolico-neutral-900', {
    variants: {
        variant: {
            xl: 'text-[24px] leading-[32px] tracking-[-0.36px]',
            lg: 'text-[18px] leading-[24px] tracking-[-0.27px]',
            md: 'text-[16px] leading-[24px] tracking-[-0.176px]',
            sm: 'text-[14px] leading-[20px] tracking-[-0.084px]',
            xs: 'text-[12px] leading-[16px] tracking-[-0.48px]',
        },
    },
    defaultVariants: {
        variant: 'md',
    },
});

export interface ParagraphProps
    extends React.HTMLAttributes<HTMLParagraphElement>,
        VariantProps<typeof paragraphVariants> {
    asChild?: boolean;
}

const Paragraph = React.forwardRef<HTMLParagraphElement, ParagraphProps>(
    ({ className, variant, asChild = false, ...props }, ref) => {
        const Element = asChild ? Slot : 'p';

        return (
            <Element
                className={cn(paragraphVariants({ variant, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Paragraph.displayName = 'Paragraph';

export { Paragraph, paragraphVariants };
