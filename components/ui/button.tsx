import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
    'inline-flex items-center justify-center whitespace-nowrap rounded-md text-[14px] leading-[20px] gap-2 tracking-[-0.084px] font-medium ring-offset-background transition-colors focus:outline-none disabled:pointer-events-none disabled:bg-neutral-100 disabled:text-neutral-300 cursor-pointer',
    {
        variants: {
            variant: {
                default:
                    'bg-gold-500 text-primary-foreground shadow hover:bg-gold-500/80',
                'sidebar-item':
                    'group flex h-[44px] w-full items-center justify-start rounded-[8px] disabled:bg-neutral-100/70 p-[12px] no-underline hover:bg-neutral-100 hover:no-underline ',
                neutral:
                    'bg-neutral-700 text-white hover:bg-neutral-900  focus:ring-[#E4E5E7] shadow-[0px_1px_2px_0px_rgba(82,88,102,0.06)]',
                'neutral-outlined':
                    'bg-white text-neutral-500 border border-neutral-200 hover:bg-neutral-100 hover:border-transparent hover:text-neutral-900 disabled:border-transparent focus:ring-[#E4E5E7] focus:border-neutral-900 focus:text-neutral-900 shadow-[0px_1px_2px_0px_rgba(82,88,102,0.06)]',
                destructive:
                    'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
                success:
                    'bg-emerald-500 text-destructive-foreground shadow-sm hover:bg-emerald-500/90',
                outline:
                    'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
                secondary:
                    'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
                ghost: 'bg-transparent text-neutral-500 hover:bg-neutral-100  hover:text-neutral-900 focus:text-neutral-900',
                link: 'text-primary underline-offset-4 hover:underline',
            },
            size: {
                icon: 'h-10 w-10',
                icon_small: 'h-8 w-8',
                default: 'h-[40px] px-[10px] py-[10px] rounded-[12px]',
                md: 'h-[36px] px-[8px] py-[8px] rounded-[8px]',
                sm: 'h-[32px] px-[6px] py-[6px] rounded-[8px]',
                mobile: 'h-[52px] px-[10px] py-[16px] rounded-[8px]',
                'link-md': 'h-[20px] text-[14px] px-0 py-0 font-medium',
                'link-sm': 'h-[16px] text-[12px] px-0 py-0 font-medium',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button';
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
