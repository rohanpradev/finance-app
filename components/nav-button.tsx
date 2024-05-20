import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Props = {
  label: string;
  href: string;
  isActive?: boolean;
};
export const NavButton = ({ label, href, isActive }: Props) => {
  return (
    <Button
      asChild
      size="sm"
      variant="outline"
      className={cn(
        "w-full justify-between border-none font-normal text-white outline-none transition lg:w-auto focus:bg-white/30 hover:bg-white/20 hover:text-white focus-visiable:ring-transparent focus:ring-offset-0",
        isActive ? "bg-white/10" : "bg-transparent",
      )}
    >
      <Link href={href}>{label}</Link>
    </Button>
  );
};
