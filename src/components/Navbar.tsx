"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import logo from "@/assets/logo.png";
import { getPlan, getSaved } from "@/lib/fitlog";

export default function Navbar() {
  const pathname = usePathname();

  const [planCount, setPlanCount] = useState(0);
  const [savedCount, setSavedCount] = useState(0);

  const workoutsActive = pathname === "/" || pathname.startsWith("/workout/");

  const myPlanActive = pathname === "/my-plan";

  useEffect(() => {
    const updateCounts = () => {
      setPlanCount(getPlan().length);
      setSavedCount(getSaved().length);
    };

    updateCounts();

    window.addEventListener("fitlog-storage-update", updateCounts);
    window.addEventListener("storage", updateCounts);

    return () => {
      window.removeEventListener("fitlog-storage-update", updateCounts);
      window.removeEventListener("storage", updateCounts);
    };
  }, []);

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-[100] border-b border-[#222630] bg-[#0C0D10]">
        <div className="mx-auto flex min-h-[72px] max-w-[1280px] items-center gap-3 px-4 sm:gap-4 sm:px-6 lg:h-[81px]">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <Image
              src={logo}
              alt="FitLog logo"
              width={28}
              height={28}
              className="h-7 w-7 object-contain"
            />

            <span className="font-['Oswald'] text-[18px] font-bold tracking-[0.9px]">
              FITLOG
            </span>
          </Link>

          {/* Main Navigation */}
          <nav className="mx-auto flex items-center gap-1 sm:gap-2">
            <Link
              href="/"
              className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition sm:px-4 sm:text-[12px] ${
                workoutsActive
                  ? "bg-[#1A2312] text-[#C2F800]"
                  : "text-[#9CA3AF] hover:text-white"
              }`}
            >
              Workouts
            </Link>

            <Link
              href="/my-plan"
              className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition sm:px-4 sm:text-[12px] ${
                myPlanActive
                  ? "bg-[#1A2312] text-[#C2F800]"
                  : "text-[#9CA3AF] hover:text-white"
              }`}
            >
              My Plan
            </Link>
          </nav>

          {/* Right Counters */}
          <div className="flex shrink-0 items-center gap-3 sm:gap-5">
            <Link
              href="/my-plan"
              className="flex items-center gap-1.5 text-[11px] font-semibold text-[#E5E7EB] sm:gap-2 sm:text-[12px]"
            >
              <span>Plan</span>

              {/* Only count is lime */}
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#C2F800] text-[11px] font-bold text-[#0C0D10]">
                {planCount}
              </span>
            </Link>

            <Link
              href="/my-plan"
              className="flex items-center gap-1.5 text-[11px] font-semibold text-[#E5E7EB] sm:gap-2 sm:text-[12px]"
            >
              <span>Saved</span>

              {/* Only count has border */}
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#2D313B] text-[11px] font-medium text-[#E5E7EB]">
                {savedCount}
              </span>
            </Link>
          </div>
        </div>
      </header>

      <div className="h-[72px] lg:h-[81px]" aria-hidden="true" />
    </>
  );
}
