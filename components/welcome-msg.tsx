"use client";

import { useUser } from "@clerk/nextjs";

export const WelcomeMsg = () => {
  const { isLoaded, user } = useUser();
  return (
    <div className="mb-4 space-y-2">
      <h2 className="font-medium text-2xl text-white lg:text-4xl">
        Welcome Back{isLoaded ? ", " : " "} {user?.firstName}
      </h2>
      <p className="text-[#89B6FD] text-sm lg:text-base">This is your Financial Overview Report</p>
    </div>
  );
};
