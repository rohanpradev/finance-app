import Image from "next/image";
import Link from "next/link";

export const HeaderLogo = () => {
  return (
    <Link href="/">
      <div className="hidden items-center lg:flex">
        <Image height={28} width={28} src="/logo.svg" alt="logo" />
        <p className="ml-2.5 font-semibold text-2xl text-white">Finance</p>
      </div>
    </Link>
  );
};
