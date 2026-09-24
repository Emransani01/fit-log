import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col bg-[#0F1115] text-white">
      <header className="border-b border-[#222630] bg-[#0C0D10]">
        <div className="mx-auto flex h-[72px] max-w-[1280px] items-center px-6">
          <Link
            href="/"
            className="font-['Oswald'] text-[18px] font-bold tracking-[0.9px]"
          >
            FITLOG
          </Link>
        </div>
      </header>

      <section className="flex flex-1 items-center justify-center px-6">
        <div className="w-full max-w-[560px] rounded-2xl border border-[#222630] bg-[#15171D] px-6 py-14 text-center sm:px-10">
          <p className="text-[11px] font-bold tracking-[1.1px] text-[#C2F800]">
            ERROR 404
          </p>

          <h1 className="mt-3 font-['Oswald'] text-[42px] font-bold leading-none tracking-[-1px] sm:text-[52px]">
            WORKOUT NOT FOUND
          </h1>

          <p className="mx-auto mt-5 max-w-[420px] text-[14px] leading-6 text-[#9CA3AF]">
            The page you&apos;re looking for doesn&apos;t exist or may have been
            moved.
          </p>

          <Link
            href="/"
            className="mt-7 inline-flex h-10 items-center rounded-md bg-[#C2F800] px-6 text-[12px] font-bold text-[#0F1115] transition hover:bg-[#CCFF00]"
          >
            BACK TO WORKOUTS
          </Link>
        </div>
      </section>

      <footer className="border-t border-[#222630] bg-[#0C0D10]">
        <div className="mx-auto flex min-h-[100px] max-w-[1280px] items-center justify-between gap-6 px-6">
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

          <p className="text-right text-[12px] leading-5 text-[#6B7280]">
            © 2026 FitLog — Workout Library.
            <br />
            Train hard, log honest.
          </p>
        </div>
      </footer>
    </main>
  );
}
