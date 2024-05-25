"use client";

import { NavButton } from "@/components/nav-button";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useMedia } from "react-use";

const routes = [
  { label: "Overview", href: "/" },
  { label: "Transactions", href: "/transactions" },
  { label: "Accounts", href: "/accounts" },
  { label: "Categories", href: "/categories" },
  { label: "Settings", href: "/settings" },
];

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const path = usePathname();
  const router = useRouter();
  const isMobile = useMedia("(max-width: 1024px)", false);

  const handleNavigation = (route: string) => {
    router.push(route);
    setIsOpen(false);
  };

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger>
          <Button
            className="border-none bg-white/10 font-normal text-white outline-none transition focus:bg-white/30 hover:bg-white/20 hover:text-white focus-visible:ring-transparent focus-visible:ring-offset-0"
            variant="outline"
            size="sm"
          >
            <Menu className="size-4" />
          </Button>
        </SheetTrigger>
        <SheetContent className="px-2" side="left">
          <nav className="flex flex-col gap-y-2 pt-6">
            {routes.map(({ href, label }) => (
              <Button
                className="w-full justify-start"
                onClick={() => handleNavigation(href)}
                variant={href === path ? "secondary" : "ghost"}
                key={href}
              >
                {label}
              </Button>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <nav className="hidden items-center gap-x-2 overflow-x-auto lg:flex">
      {routes.map(({ href, label }) => (
        <NavButton key={href} href={href} label={label} isActive={path === href} />
      ))}
    </nav>
  );
};
