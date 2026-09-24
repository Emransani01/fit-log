"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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
  const [activeTab, setActiveTab] = useState<Tab>("plan");
  const [plan, setPlan] = useState<Workout[]>([]);
  const [saved, setSaved] = useState<Workout[]>([]);
  const [completed, setCompleted] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("duration");
  const [toast, setToast] = useState("");

  useEffect(() => {
    const loadStorage = () => {
      setPlan(getPlan());
      setSaved(getSaved());
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

    return () => window.clearTimeout(timer);
  }, [toast]);

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
    0
  );

  const totalCalories = plan.reduce(
    (total, workout) => total + workout.caloriesBurned,
    0
  );

  const handleDone = (id: number) => {
    setCompleted((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );

    setToast("Workout marked as done.");
  };

  const handleRemove = (id: number) => {
    if (activeTab === "plan") {
      removeFromPlan(id);
      setPlan(getPlan());
      setToast("Workout removed from today’s plan.");
    } else {
      removeFromSaved(id);
      setSaved(getSaved());
      setToast("Workout removed from saved.");
    }
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0C0D10] text-white">
      <Navbar />

      <section className="mx-auto max-w-[1232px] px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-14">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-[10px] font-bold tracking-[1.1px] text-[#C2F800] sm:text-[11px]">
              YOUR WORKOUTS
            </p>

            <h1 className="mt-2 font-['Oswald'] text-[36px] font-bold leading-none tracking-[-0.8px] sm:text-[44px]">
              MY PLAN
            </h1>

            <p className="mt-3 max-w-[560px] text-[13px] leading-5 text-[#9CA3AF] sm:text-[14px]">
              Keep today&apos;s work focused, then save anything you want to
              revisit later.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:min-w-[430px]">
            <Metric
              label="Exercises"
              value={String(plan.length)}
            />

            <Metric
              label="Minutes"
              value={String(totalMinutes)}
            />

            <Metric
              label="Calories"
              value={String(totalCalories)}
            />
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-b border-[#222630] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-6">
            <button
              type="button"
              onClick={() => setActiveTab("plan")}
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
              onClick={() => setActiveTab("saved")}
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
            <label
              htmlFor="sort"
              className="text-[11px] text-[#6B7280]"
            >
              Sort
            </label>

            <select
              id="sort"
              value={sortBy}
              onChange={(event) =>
                setSortBy(event.target.value as SortOption)
              }
              className="rounded-lg border border-[#2A2F39] bg-[#15171D] px-3 py-2 text-[11px] text-[#E5E7EB] outline-none"
            >
              <option value="duration">Duration</option>
              <option value="calories">Calories</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>

        {sortedWorkouts.length === 0 ? (
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
              BROWSE WORKOUTS
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {sortedWorkouts.map((workout) => {
              const isDone = completed.includes(workout.id);

              return (
                <article
                  key={workout.id}
                  className={`overflow-hidden rounded-2xl border border-[#222630] bg-[#15171D] transition ${
                    isDone ? "opacity-60" : ""
                  }`}
                >
                  <div className="flex flex-col sm:flex-row">
                    <div className="h-[190px] shrink-0 sm:h-auto sm:w-[220px]">
                      <img
                        src={workout.image}
                        alt={workout.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h2 className="font-['Oswald'] text-[18px] font-bold leading-6 tracking-[0.35px]">
                            {workout.name.toUpperCase()}
                          </h2>

                          <p className="mt-1 text-[12px] text-[#9CA3AF]">
                            {workout.equipment}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemove(workout.id)}
                          aria-label={`Remove ${workout.name}`}
                          className="shrink-0 text-xl leading-none text-[#6B7280] transition hover:text-white"
                        >
                          ×
                        </button>
                      </div>

                      <div className="mt-5 grid grid-cols-3 gap-3">
                        <SmallStat
                          label="Duration"
                          value={`${workout.duration} min`}
                        />

                        <SmallStat
                          label="Calories"
                          value={`${workout.caloriesBurned} kcal`}
                        />

                        <SmallStat
                          label="Rating"
                          value={`★ ${workout.rating}`}
                        />
                      </div>

                      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                        <Link
                          href={`/workout/${workout.id}`}
                          className="inline-flex h-9 items-center justify-center rounded-lg border border-[#374151] px-4 text-[11px] font-semibold text-[#E5E7EB] transition hover:bg-[#1A1D24]"
                        >
                          View Details
                        </Link>

                        {activeTab === "plan" && (
                          <button
                            type="button"
                            onClick={() => handleDone(workout.id)}
                            className={`inline-flex h-9 items-center justify-center rounded-lg px-4 text-[11px] font-bold transition ${
                              isDone
                                ? "bg-[#252A31] text-[#9CA3AF]"
                                : "bg-[#C2F800] text-[#0C0D10] hover:bg-[#CCFF00]"
                            }`}
                          >
                            {isDone ? "Done" : "Mark as Done"}
                          </button>
                        )}
                      </div>
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
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-[#222630] bg-[#15171D] px-4 py-3">
      <p className="text-[10px] uppercase text-[#6B7280]">
        {label}
      </p>

      <p className="mt-1 font-['Oswald'] text-[22px] font-bold">
        {value}
      </p>
    </div>
  );
}

function SmallStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <p className="truncate text-[10px] uppercase text-[#6B7280]">
        {label}
      </p>

      <p className="mt-1 truncate text-[11px] text-[#E5E7EB]">
        {value}
      </p>
    </div>
  );
}