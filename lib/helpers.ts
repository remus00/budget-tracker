import { Currencies } from '@/constants/currencies';

export const dateToUTCDate = (date: Date) => {
    return new Date(
        Date.UTC(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds(),
            date.getMilliseconds()
        )
    );
};

export const getFormatterForCurrency = (currency: string) => {
    const locale = Currencies.find((cur) => cur.value === currency)?.locale;

    return new Intl.NumberFormat(locale, { style: 'currency', currency });
};
