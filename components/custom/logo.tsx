import { Icon } from '@iconify/react/dist/iconify.js';
import Link from 'next/link';
import { Paragraph } from './copy/paragraph';

export const Logo = () => {
    return (
        <Link href="/" className="flex items-end justify-center">
            <Icon icon="tabler:report-money" className="size-10 text-emerald-500" />
            <Paragraph className="bg-gradient-to-r from-sky-500 to-emerald-500 bg-clip-text text-2xl font-bold leading-tight tracking-tighter text-transparent transition-all group-data-[collapsible=icon]:hidden">
                WiseWallet
            </Paragraph>
        </Link>
    );
};
