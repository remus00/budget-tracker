'use client';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { navbarItem } from '@/constants';
import { UserButton } from '@clerk/nextjs';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import { Logo } from '../logo';
import { ThemeSwitcherButton } from '../theme-switcher-button';
import { NavbarItem } from './navbar-item';

export const MobileNavbar = () => {
    const [open, setIsOpen] = useState<boolean>(false);
    return (
        <div className="block bg-background md:hidden">
            <nav className="container flex w-full items-center justify-between px-4">
                <div className="flex h-[80px] min-h-[60px] w-full items-center justify-between gap-x-4">
                    <Logo />

                    <div className="flex items-center gap-4">
                        <UserButton afterSignOutUrl="/sign-in" />

                        <Sheet open={open} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu />
                                </Button>
                            </SheetTrigger>
                            <SheetContent className="w-[400px] sm:w-[540px]" side="right">
                                <div className="flex items-center justify-between pt-4">
                                    <SheetHeader>
                                        <SheetTitle>
                                            <Logo />
                                        </SheetTitle>
                                    </SheetHeader>
                                    <ThemeSwitcherButton />
                                </div>

                                <div className="flex flex-col gap-1 pt-4">
                                    {navbarItem.map(({ label, link }, idx) => (
                                        <NavbarItem
                                            key={idx}
                                            label={label}
                                            link={link}
                                            onClickHandler={() =>
                                                setIsOpen((prev) => !prev)
                                            }
                                        />
                                    ))}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </nav>
        </div>
    );
};
