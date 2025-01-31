import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const headingVariants = cva('font-medium text-wolico-neutral-900', {
    variants: {
        variant: {
            h2: 'text-[48px] leading-[56px] tracking-[-0.48px] font-inter-display',
            h1: 'text-[56px] leading-[64px] tracking-[-0.56px] font-inter-display',
            h3: 'text-[40px] leading-[58px] tracking-[-0.4px] font-inter-display',
            h4: 'text-[32px] leading-[40px] font-inter-display',
            h5: 'text-[24px] leading-[32px] font-inter-display',
            h6: 'text-[20px] leading-[28px] font-inter-display',
            'sub-md': 'text-[16px] leading-[24px] tracking-[0.96px]',
            'sub-sm': 'text-[14px] leading-[20px] tracking-[0.84px]',
            'sub-xs': 'text-[12px] leading-[16px] tracking-[0.48px]',
            'sub-xxs': 'text-[11px] leading-[12px] tracking-[0.22px]',
            'label-xl': 'text-[24px] leading-[32px] tracking-[-0.36px]',
            'label-lg': 'text-[18px] leading-[24px] tracking-[-0.27px]',
            'label-md': 'text-[16px] leading-[24px] tracking-[-0.176px]',
            'label-sm': 'text-[14px] leading-[20px] tracking-[-0.084px]',
            'label-xs': 'text-[12px] leading-[16px]',
        },
    },
    defaultVariants: {
        variant: 'h1',
    },
});

export interface HeadingProps
    extends React.HTMLAttributes<HTMLHeadingElement>,
        VariantProps<typeof headingVariants> {
    asChild?: boolean;
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
    ({ className, variant, asChild = false, ...props }, ref) => {
        const variantToElement = {
            h1: 'h1',
            h2: 'h2',
            h3: 'h3',
            h4: 'h4',
            h5: 'h5',
            h6: 'h6',
            'sub-md': 'h3',
            'sub-sm': 'h4',
            'sub-xs': 'h5',
            'sub-xxs': 'h6',
            'label-xl': 'p',
            'label-lg': 'p',
            'label-md': 'p',
            'label-sm': 'p',
            'label-xs': 'p',
        };

        const Element = asChild
            ? Slot
            : variantToElement[variant as keyof typeof variantToElement] || 'h1';

        return (
            <Element
                className={cn(headingVariants({ variant, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Heading.displayName = 'Heading';

export { Heading, headingVariants };
