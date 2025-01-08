import { Overview } from '@/components/custom/overview';
import { CreateTransactionDialog } from '@/components/custom/transactions/create-transaction-dialog';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
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
        <div className="h-full bg-background">
            <div className="border-b bg-card">
                <div className="container mx-auto flex flex-wrap items-center justify-between gap-6 px-8 py-8">
                    <p className="text-3xl font-bold">Hello, {user.firstName}! 👋🏻</p>

                    <div className="flex items-center gap-3">
                        <CreateTransactionDialog
                            type="income"
                            trigger={
                                <Button variant="outline" className="green-btn">
                                    New income 🤑
                                </Button>
                            }
                        />

                        <CreateTransactionDialog
                            type="expense"
                            trigger={
                                <Button variant="outline" className="rose-btn">
                                    New expense 🫡
                                </Button>
                            }
                        />
                    </div>
                </div>
            </div>
            <Overview userSetting={userSetting} />
        </div>
    );
};

export default HomePage;
