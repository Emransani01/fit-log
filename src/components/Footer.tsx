import Image from "next/image";
import Link from "next/link";

import logo from "@/assets/logo.png";

export default function Footer() {
  return (
    <footer className="border-t border-[#222630] bg-[#0C0D10]">
      <div className="mx-auto flex min-h-[120px] max-w-[1280px] flex-col items-start justify-center gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-0">
        <Link href="/" className="flex items-center gap-2.5">
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

        <p className="text-left text-[12px] leading-5 text-[#6B7280] sm:text-right">
          © 2026 FitLog — Workout Library.
          <br />
          Train hard, log honest.
        </p>
      </div>
    </footer>
  );
}
