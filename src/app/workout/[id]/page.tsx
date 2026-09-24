"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { addToPlan, getPlan, saveForLater, type Workout } from "@/lib/fitlog";

export default function WorkoutDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [planCount, setPlanCount] = useState(0);

  useEffect(() => {
    const loadWorkout = async () => {
      try {
        const { id } = await params;

        const response = await fetch(
          `https://api.abcz.workers.dev/api/fitlog/${id}`,
        );

        if (!response.ok) {
          throw new Error("Workout not found");
        }

        const data: Workout = await response.json();

        setWorkout(data);
      } catch {
        setWorkout(null);
      } finally {
        setLoading(false);
      }
    };

    loadWorkout();
  }, [params]);

  useEffect(() => {
    const updatePlanCount = () => {
      setPlanCount(getPlan().length);
    };

    updatePlanCount();

    window.addEventListener("fitlog-storage-update", updatePlanCount);
    window.addEventListener("storage", updatePlanCount);

    return () => {
      window.removeEventListener("fitlog-storage-update", updatePlanCount);
      window.removeEventListener("storage", updatePlanCount);
    };
  }, []);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = window.setTimeout(() => {
      setToast("");
    }, 2500);

    return () => window.clearTimeout(timer);
  }, [toast]);

  const handleAddToPlan = () => {
    if (!workout) {
      return;
    }

    const result = addToPlan(workout);

    setToast(result.message);
    setPlanCount(getPlan().length);
  };

  const handleSave = () => {
    if (!workout) {
      return;
    }

    const result = saveForLater(workout);

    setToast(result.message);
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0F1115] text-white">
        <p className="text-sm text-[#9CA3AF]">Loading workouts…</p>
      </main>
    );
  }

  if (!workout) {
    return (
      <main className="flex min-h-screen flex-col bg-[#0F1115] text-white">
        <Navbar />

        <section className="flex flex-1 items-center justify-center px-6">
          <div className="text-center">
            <h1 className="font-['Oswald'] text-3xl font-bold">
              WORKOUT NOT FOUND
            </h1>

            <Link
              href="/"
              className="mt-6 inline-flex rounded-xl bg-[#CCFF00] px-6 py-3 text-sm font-semibold text-[#0F1115]"
            >
              Back to workouts
            </Link>
          </div>
        </section>

        <Footer />
      </main>
    );
  }

  const isPlanFull = planCount >= 5;

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0F1115] text-white">
      <Navbar />

      <section className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
        <div className="grid gap-8 md:gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="h-[360px] overflow-hidden rounded-2xl border border-[#232834] bg-[#171A21] sm:h-[500px] md:h-[600px] lg:h-[735px]">
            <img
              src={workout.image}
              alt={workout.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <div className="mb-4 flex flex-wrap gap-2 sm:mb-5">
              {workout.muscleGroups.map((muscle) => (
                <span
                  key={muscle}
                  className="rounded-full bg-[#CCFF00] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.5px] text-[#0F1115] sm:px-3.5 sm:text-[11px]"
                >
                  {muscle}
                </span>
              ))}
            </div>

            <h1 className="font-['Oswald'] text-[30px] font-bold leading-9 tracking-[-0.7px] sm:text-[36px] sm:leading-10 sm:tracking-[-0.9px]">
              {workout.name.toUpperCase()}
            </h1>

            <p className="mt-4 text-[14px] leading-6 text-[#9CA3AF] sm:mt-5 sm:text-[16px]">
              {workout.description}
            </p>

            <div className="mt-6 overflow-hidden rounded-2xl border border-[#232834] bg-[#151922] sm:mt-8">
              <SpecRow label="EQUIPMENT" value={workout.equipment} />
              <SpecRow label="DIFFICULTY" value={workout.difficulty} />
              <SpecRow label="SETS" value={String(workout.sets)} />
              <SpecRow label="REPS" value={workout.reps} />
              <SpecRow label="DURATION" value={`${workout.duration} min`} />
              <SpecRow
                label="CALORIES"
                value={`${workout.caloriesBurned} kcal`}
              />
              <SpecRow label="RATING" value={`★ ${workout.rating}`} last />
            </div>

            <div className="mt-7 sm:mt-8">
              <h2 className="text-[15px] font-extrabold uppercase tracking-[0.8px] sm:text-[16px]">
                INSTRUCTIONS
              </h2>

              <div className="mt-4 space-y-4">
                {workout.instructions.slice(0, 4).map((instruction, index) => (
                  <div key={index} className="flex gap-3 sm:gap-4">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#CCFF00] text-[11px] font-bold text-[#0F1115]">
                      {index + 1}
                    </span>

                    <p className="text-[13px] leading-[22px] text-[#D1D5DB] sm:text-[14px] sm:leading-[22.75px]">
                      {instruction}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                onClick={handleAddToPlan}
                disabled={isPlanFull}
                className={`inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl px-6 text-[14px] font-semibold transition sm:w-auto ${
                  isPlanFull
                    ? "cursor-not-allowed bg-[#3A3E46] text-[#777D88]"
                    : "bg-[#CCFF00] text-[#0F1115] hover:bg-[#C2F800]"
                }`}
              >
                <span aria-hidden="true">＋</span>

                {isPlanFull ? "Today's plan is full" : "Add to today's plan"}
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="inline-flex h-[46px] w-full items-center justify-center gap-2 rounded-xl border border-[#374151] px-6 text-[14px] font-medium text-[#E5E7EB] transition hover:bg-[#171A21] sm:w-auto"
              >
                <span aria-hidden="true">♡</span>
                Save for later
              </button>
            </div>

            {isPlanFull && (
              <p className="mt-3 text-[12px] leading-5 text-[#8A92A0]">
                Your plan already has five workouts. Remove one from My Plan to
                add another.
              </p>
            )}
          </div>
        </div>
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

function SpecRow({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 px-4 py-3.5 sm:px-6 ${
        last ? "" : "border-b border-[#1E2330]"
      }`}
    >
      <span className="text-[11px] font-bold leading-4 text-[#9CA3AF] sm:text-[12px]">
        {label}
      </span>

      <span className="text-right text-[13px] font-medium leading-5 text-[#E5E7EB] sm:text-[14px]">
        {value}
      </span>
    </div>
  );
}
