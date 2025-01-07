import { navbarItem } from '@/constants';
import { UserButton } from '@clerk/nextjs';
import { Logo } from '../logo';
import { ThemeSwitcherButton } from '../theme-switcher-button';
import { NavbarItem } from './navbar-item';

export const DesktopNavbar = () => {
    return (
        <div className="hidden border-separate border-b bg-background md:block">
            <nav className="container mx-auto flex items-center justify-between px-8">
                <div className="flex h-[80px] min-h-[60px] items-center gap-4">
                    <Logo />
                    <div className="flex w-full">
                        {navbarItem.map(({ label, link }, idx) => (
                            <NavbarItem key={idx} label={label} link={link} />
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <ThemeSwitcherButton />
                    <UserButton afterSignOutUrl="/sign-in" />
                </div>
            </nav>
        </div>
    );
};
