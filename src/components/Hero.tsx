import Image from "next/image";

import banner from "@/assets/banner.png";

export default function Hero() {
  return (
    <section className="px-4 pt-6 sm:px-6 sm:pt-10 lg:pt-12">
      <div className="mx-auto flex max-w-[1232px] flex-col items-center justify-between gap-8 rounded-2xl border border-[#222630] bg-[#15171D] p-6 sm:p-8 md:flex-row md:p-10 lg:min-h-[448px] lg:gap-10 lg:p-14">
        <div className="max-w-[558px]">
          <p className="mb-4 text-[10px] font-bold tracking-[1.1px] text-[#C2F800] sm:text-[11px]">
            WORKOUT LIBRARY
          </p>

          <h1 className="font-['Oswald'] text-[40px] font-bold leading-[42px] tracking-[-1px] sm:text-[48px] sm:leading-[50px] lg:text-[60px] lg:leading-[60px] lg:tracking-[-1.5px]">
            TRAIN WITH INTENT.
            <br />
            LOG EVERY SET.
          </h1>

          <p className="mt-5 max-w-[540px] text-[14px] leading-6 text-[#9CA3AF] sm:text-[16px]">
            FitLog is a dark, no-nonsense gym companion: pick a lift, lock it
            into today&apos;s plan, and watch the week&apos;s work add up.
          </p>

          <a
            href="#library"
            className="mt-7 inline-flex h-10 items-center gap-2 rounded-md bg-[#C2F800] px-6 text-[12px] font-bold text-[#0C0D10] transition hover:bg-[#CCFF00]"
          >
            BROWSE WORKOUTS
            <span aria-hidden="true">→</span>
          </a>
        </div>

        <div className="shrink-0">
          <Image
            src={banner}
            alt="Workout illustration"
            width={334}
            height={334}
            className="h-[220px] w-[220px] object-contain sm:h-[260px] sm:w-[260px] md:h-[240px] md:w-[240px] lg:h-[334px] lg:w-[334px]"
            priority
          />
        </div>
      </div>
    </section>
  );
}
