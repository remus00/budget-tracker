import { Currencies } from '@/constants/currencies';
import { z } from 'zod';

export const UpdateUserCurrencySchema = z.object({
    currency: z.custom((value) => {
        const found = Currencies.some((cur) => cur.value === value);

        if (found === false) throw new Error(`Invalid currency: ${value}`);

        return value;
    }),
});
