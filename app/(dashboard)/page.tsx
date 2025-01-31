import { History } from '@/components/custom/history/history';
import { Navbar } from '@/components/custom/navbar/navbar';
import { Overview } from '@/components/custom/overview/overview';
import { CreateTransactionDialog } from '@/components/custom/transactions/create-transaction-dialog';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import { Icon } from '@iconify/react/dist/iconify.js';
import { redirect } from 'next/navigation';

const HomePage = async () => {
    const user = await currentUser();

    if (!user) redirect('/sign-in');

    const userSetting = await db.userSettings.findUnique({
        where: {
            userId: user.id,
        },
    });

    if (!userSetting) redirect('/wizard');

    return (
        <div className="mb-4">
            <Navbar
                label="Dashboard"
                description={`Hello, ${user.firstName}! 👋🏻`}
                icon="lucide:layout-dashboard"
                secondaryButton={
                    <CreateTransactionDialog
                        type="income"
                        trigger={
                            <Button variant="success">
                                New income{' '}
                                <Icon
                                    icon="lucide:arrow-up-from-line"
                                    className="text-[16px]"
                                />
                            </Button>
                        }
                    />
                }
                button={
                    <CreateTransactionDialog
                        type="expense"
                        trigger={
                            <Button variant="destructive">
                                New expense{' '}
                                <Icon
                                    icon="lucide:arrow-down-from-line"
                                    className="text-[16px]"
                                />
                            </Button>
                        }
                    />
                }
            />
            {/* <TestBreakpoint /> */}
            <Overview userSettings={userSetting} />
            <History userSettings={userSetting} />
        </div>
    );
};

export default HomePage;
