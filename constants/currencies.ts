import { ICurrency } from '@/types/currency';

export const Currencies = [
    {
        value: 'USD',
        label: '$ Dollar',
        locale: 'en-US',
    },
    {
        value: 'EUR',
        label: '€ Euro',
        locale: 'de-DE',
    },
    {
        value: 'JPY',
        label: '¥ Yen',
        locale: 'jp-JP',
    },
    {
        value: 'GBP',
        label: '£ Pound',
        locale: 'en-GB',
    },
] satisfies ICurrency[];
