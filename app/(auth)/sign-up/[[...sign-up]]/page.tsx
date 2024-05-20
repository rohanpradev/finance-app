import { ClerkLoaded, ClerkLoading, SignUp } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import Image from "next/image";

const SignUpPage = () => {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="h-full flex-col items-center justify-center px-4 lg:flex">
        <div className="space-y-4 pt-16 text-center">
          <h1 className="font-bold text-3xl text-[#2E2A47]">Welcome Back!</h1>
          <p className="text-[#7E8CA0] text-base">
            Login or Create account to get back to your dashboard!
          </p>
          <div className="mt-8 flex items-center justify-center">
            <ClerkLoaded>
              <SignUp path="/sign-up" />
            </ClerkLoaded>
            <ClerkLoading>
              <Loader2 className="animate-spin text-muted-foreground" />
            </ClerkLoading>
          </div>
        </div>
      </div>
        <div className="hidden h-full items-center justify-center bg-blue-600 lg:flex">
          <Image height={100} width={100} alt="logo" src="/logo.svg" />
        </div>
    </div>
  );
};

export default SignUpPage;
