import Image from "next/image";
import Link from "next/link";
import React from "react";
import MobileNav from "./MobileNav";
import { UserButton } from "@clerk/nextjs/app-beta";
import { SignedIn } from "@clerk/nextjs/app-beta/client";

const Navbar = () => {
  return (
    <nav className="flex-between fixed z-50 w-full bg-dark-1 px-6 py-4 lh:px-10">
      <div className="flex items-center gap-1">
        <Image
          src="/icons/logo.svg"
          height={32}
          width={32}
          alt="Zoom logo"
          className="max-sm:size-10"
        />
        <p className="text-[26px] font-extrabold text-white max-sm:hid">
          Zooom
        </p>
      </div>

      <div className="flex-between gap-5">
        <SignedIn>
          {/* Mount the UserButton component */}
          <UserButton />
        </SignedIn>

        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;
