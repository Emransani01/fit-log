"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import {
  getPlan,
  getSaved,
  removeFromPlan,
  removeFromSaved,
  type Workout,
} from "@/lib/fitlog";

type Tab = "plan" | "saved";
type SortOption = "duration" | "calories" | "rating";

export default function MyPlan() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen flex-col bg-[#0C0D10] text-white">
          <Navbar />

          <section className="flex flex-1 items-center justify-center px-6">
            <p className="text-[13px] text-[#9CA3AF]">Loading workouts…</p>
          </section>

          <Footer />
        </main>
      }
    >
      <MyPlanContent />
    </Suspense>
  );
}

function MyPlanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [plan, setPlan] = useState<Workout[]>([]);
  const [saved, setSaved] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("duration");
  const [toast, setToast] = useState("");

  const activeTab: Tab = searchParams.get("tab") === "saved" ? "saved" : "plan";

  useEffect(() => {
    const loadStorage = () => {
      setPlan(getPlan());
      setSaved(getSaved());
      setLoading(false);
    };

    loadStorage();

    window.addEventListener("fitlog-storage-update", loadStorage);
    window.addEventListener("storage", loadStorage);

    return () => {
      window.removeEventListener("fitlog-storage-update", loadStorage);
      window.removeEventListener("storage", loadStorage);
    };
  }, []);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = window.setTimeout(() => {
      setToast("");
    }, 2500);

    return () => {
      window.clearTimeout(timer);
    };
  }, [toast]);

  const handleTabChange = (tab: Tab) => {
    router.push(`/my-plan?tab=${tab}`);
  };

  const currentList = activeTab === "plan" ? plan : saved;

  const sortedWorkouts = useMemo(() => {
    return [...currentList].sort((a, b) => {
      if (sortBy === "calories") {
        return b.caloriesBurned - a.caloriesBurned;
      }

      if (sortBy === "rating") {
        return b.rating - a.rating;
      }

      return a.duration - b.duration;
    });
  }, [currentList, sortBy]);

  const totalMinutes = plan.reduce(
    (total, workout) => total + workout.duration,
    0,
  );

  const totalCalories = plan.reduce(
    (total, workout) => total + workout.caloriesBurned,
    0,
  );

  const handleDone = (id: number) => {
    setCompleted((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );

    setToast("Workout marked as done.");
  };

  const handleRemove = (id: number) => {
    if (activeTab === "plan") {
      removeFromPlan(id);
      setPlan(getPlan());
      setToast("Workout removed from today’s plan.");
      return;
    }

    removeFromSaved(id);
    setSaved(getSaved());
    setToast("Workout removed from saved.");
  };

  return (
    <main className="flex min-h-screen flex-col overflow-x-hidden bg-[#0C0D10] text-white">
      <Navbar />

      <section className="mx-auto w-full max-w-[1232px] flex-1 px-4 pb-12 pt-10 sm:px-6 sm:pb-14 sm:pt-12">
        <div>
          <h1 className="mt-2 font-['Oswald'] text-[36px] font-bold leading-none tracking-[-0.8px] sm:text-[44px]">
            MY PLAN
          </h1>

          <p className="mt-3 max-w-[560px] text-[13px] leading-5 text-[#9CA3AF] sm:text-[14px]">
            Keep today&apos;s work focused, then save anything you want to
            revisit later.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-3 divide-x divide-[#252A33] overflow-hidden rounded-lg border border-[#252A33] bg-[#14171E]">
          <Metric label="Exercises" value={String(plan.length)} highlight />

          <Metric label="Minutes" value={String(totalMinutes)} />

          <Metric label="Calories" value={String(totalCalories)} />
        </div>

        <div className="mt-9 flex flex-col gap-4 border-b border-[#222630] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-6">
            <button
              type="button"
              onClick={() => handleTabChange("plan")}
              className={`border-b-2 pb-3 text-[12px] font-bold transition ${
                activeTab === "plan"
                  ? "border-[#C2F800] text-white"
                  : "border-transparent text-[#6B7280] hover:text-[#E5E7EB]"
              }`}
            >
              Today&apos;s Plan
            </button>

            <button
              type="button"
              onClick={() => handleTabChange("saved")}
              className={`border-b-2 pb-3 text-[12px] font-bold transition ${
                activeTab === "saved"
                  ? "border-[#C2F800] text-white"
                  : "border-transparent text-[#6B7280] hover:text-[#E5E7EB]"
              }`}
            >
              Saved
            </button>
          </div>

          <div className="mb-3 flex items-center gap-2 sm:mb-2">
            <label htmlFor="sort" className="text-[11px] text-[#6B7280]">
              Sort By
            </label>

            <select
              id="sort"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as SortOption)}
              className="rounded-lg border border-[#2A2F39] bg-[#15171D] px-3 py-2 text-[11px] text-[#E5E7EB] outline-none"
            >
              <option value="duration">Duration</option>
              <option value="calories">Calories</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="mt-8 rounded-2xl border border-[#222630] bg-[#15171D] px-6 py-16 text-center">
            <p className="text-[13px] text-[#9CA3AF]">Loading workouts…</p>
          </div>
        ) : sortedWorkouts.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-[#222630] bg-[#15171D] px-6 py-16 text-center">
            <h2 className="font-['Oswald'] text-[26px] font-bold">
              {activeTab === "plan"
                ? "YOUR PLAN IS EMPTY"
                : "NO SAVED WORKOUTS"}
            </h2>

            <p className="mx-auto mt-3 max-w-[440px] text-[13px] leading-5 text-[#9CA3AF]">
              {activeTab === "plan"
                ? "Add a workout from the library to start building today’s plan."
                : "Save workouts from the library to keep them here for later."}
            </p>

            <Link
              href="/"
              className="mt-6 inline-flex h-10 items-center rounded-md bg-[#C2F800] px-6 text-[12px] font-bold text-[#0C0D10] transition hover:bg-[#CCFF00]"
            >
              Go to workouts
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {sortedWorkouts.map((workout) => {
              const isDone = completed.includes(workout.id);

              return (
                <article
                  key={workout.id}
                  className={`rounded-2xl border border-[#232732] bg-[#14171E] p-5 transition hover:border-[#2D313B] ${
                    isDone ? "opacity-60" : ""
                  }`}
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                    <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-xl sm:h-32 lg:h-[88px] lg:w-[144px]">
                      <Image
                        src={workout.image}
                        alt={workout.name}
                        fill
                        sizes="(max-width: 1023px) 100vw, 144px"
                        className="object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h2 className="font-['Oswald'] text-[19px] font-bold leading-6 tracking-[0.35px]">
                        {workout.name.toUpperCase()}
                      </h2>

                      <p className="mt-1.5 text-[12px] text-[#9CA3AF]">
                        {workout.equipment}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-[#9CA3AF]">
                        <span>{workout.duration} min</span>
                        <span>{workout.caloriesBurned} kcal</span>
                        <span>★ {workout.rating}</span>
                      </div>
                    </div>

                    <div className="flex w-full flex-wrap items-center gap-2 lg:w-auto lg:shrink-0">
                      <Link
                        href={`/workout/${workout.id}`}
                        className="flex-1 rounded-lg border border-[#374151] px-4 py-2.5 text-center text-[11px] font-semibold text-[#E5E7EB] transition hover:bg-[#1A1D24] sm:flex-none"
                      >
                        View Details
                      </Link>

                      {activeTab === "plan" && (
                        <button
                          type="button"
                          onClick={() => handleDone(workout.id)}
                          className="flex-1 rounded-lg bg-[#CCFF00] px-4 py-2.5 text-[11px] font-semibold text-[#0F1115] transition hover:bg-[#C2F800] sm:flex-none"
                        >
                          {isDone ? "Done" : "Mark as Done"}
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleRemove(workout.id)}
                        aria-label={`Remove ${workout.name}`}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#374151] text-[18px] leading-none text-[#9CA3AF] transition hover:border-[#CCFF00] hover:text-white"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {toast && (
        <div className="fixed bottom-5 left-4 right-4 z-50 rounded-xl border border-[#374151] bg-[#15171D] px-5 py-3 text-center text-sm text-white shadow-xl sm:left-1/2 sm:right-auto sm:-translate-x-1/2">
          {toast}
        </div>
      )}

      <Footer />
    </main>
  );
}

function Metric({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="px-4 py-4 sm:px-6 sm:py-5">
      <p className="text-[9px] text-[#6B7280] sm:text-[10px]">{label}</p>

      <p
        className={`mt-1 font-['Oswald'] text-[20px] font-bold sm:text-[22px] ${
          highlight ? "text-[#C2F800]" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
