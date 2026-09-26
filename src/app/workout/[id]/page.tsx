"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import {
  addToPlan,
  getPlan,
  getSaved,
  removeFromSaved,
  saveForLater,
  type Workout,
} from "@/lib/fitlog";

const API_URL = "https://api.api-store.workers.dev/api/fitlog";

export default function WorkoutDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [planCount, setPlanCount] = useState(0);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loadWorkout = async () => {
      try {
        const { id } = await params;

        const response = await fetch(`${API_URL}/${id}`);

        if (!response.ok) {
          throw new Error("Workout not found");
        }

        const data: Workout = await response.json();

        setWorkout(data);

        const currentPlan = getPlan();
        const currentSaved = getSaved();

        setPlanCount(currentPlan.length);
        setSaved(currentSaved.some((item) => item.id === data.id));
      } catch {
        setWorkout(null);
      } finally {
        setLoading(false);
      }
    };

    loadWorkout();
  }, [params]);

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

    const currentPlan = getPlan();

    if (currentPlan.length >= 5) {
      setToast("Today’s plan can contain up to 5 workouts.");
      return;
    }

    if (currentPlan.some((item) => item.id === workout.id)) {
      setToast("Workout is already in today’s plan.");
      return;
    }

    addToPlan(workout);

    const updatedPlan = getPlan();

    setPlanCount(updatedPlan.length);
    setToast("Workout added to today’s plan.");
  };

  const handleSave = () => {
    if (!workout) {
      return;
    }

    const currentSaved = getSaved();
    const alreadySaved = currentSaved.some((item) => item.id === workout.id);

    if (alreadySaved) {
      removeFromSaved(workout.id);
      setSaved(false);
      setToast("Workout removed from saved.");
      return;
    }

    saveForLater(workout);
    setSaved(true);
    setToast("Workout saved for later.");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0C0D10] text-white">
        <Navbar />

        <div className="mx-auto max-w-[1232px] px-4 py-20 text-center sm:px-6">
          <p className="text-sm text-[#9CA3AF]">Loading workout…</p>
        </div>

        <Footer />
      </main>
    );
  }

  if (!workout) {
    return (
      <main className="min-h-screen bg-[#0C0D10] text-white">
        <Navbar />

        <section className="mx-auto max-w-[1232px] px-4 py-20 text-center sm:px-6">
          <p className="text-[11px] font-bold uppercase tracking-[1px] text-[#C2F800]">
            WORKOUT NOT FOUND
          </p>

          <h1 className="mt-3 font-['Oswald'] text-[36px] font-bold">
            THIS WORKOUT DOESN&apos;T EXIST
          </h1>

          <Link
            href="/"
            className="mt-6 inline-flex h-10 items-center rounded-lg bg-[#C2F800] px-6 text-[12px] font-bold text-[#0C0D10] transition hover:bg-[#CCFF00]"
          >
            BACK TO WORKOUTS
          </Link>
        </section>

        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0C0D10] text-white">
      <Navbar />

      <section className="mx-auto max-w-[1232px] px-4 pb-16 pt-8 sm:px-6 sm:pb-20 sm:pt-12">
        <Link
          href="/"
          className="inline-flex items-center text-[11px] font-semibold text-[#9CA3AF] transition hover:text-white"
        >
          ← BACK TO WORKOUTS
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-10">
          {/* Workout Image */}
          <div className="relative h-[360px] overflow-hidden rounded-2xl border border-[#232834] bg-[#171A21] sm:h-[500px] md:h-[600px] lg:h-[735px]">
            <Image
              src={workout.image}
              alt={workout.name}
              fill
              sizes="(max-width: 1023px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>

          {/* Workout Information */}
          <div className="lg:pt-2">
            {/* Muscle Groups */}
            <div className="flex flex-wrap gap-2">
              {workout.muscleGroups.map((muscle) => (
                <span
                  key={muscle}
                  className="rounded-full bg-[#C2F800] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.5px] text-[#0C0D10]"
                >
                  {muscle}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="mt-5 font-['Oswald'] text-[38px] font-bold leading-[0.98] tracking-[-0.5px] sm:text-[48px]">
              {workout.name.toUpperCase()}
            </h1>

            {/* Description */}
            <p className="mt-5 text-[14px] leading-6 text-[#9CA3AF]">
              {workout.description}
            </p>

            {/* Workout Specs - Table/List Layout */}
            <div className="mt-7 overflow-hidden rounded-xl border border-[#222630] bg-[#15171D]">
              <div className="divide-y divide-[#222630]">
                <DetailRow label="Equipment" value={workout.equipment} />

                <DetailRow label="Difficulty" value={workout.difficulty} />

                <DetailRow label="Sets" value={String(workout.sets)} />

                <DetailRow label="Reps" value={workout.reps} />

                <DetailRow label="Duration" value={`${workout.duration} min`} />

                <DetailRow
                  label="Calories"
                  value={`${workout.caloriesBurned} kcal`}
                />

                <DetailRow label="Rating" value={`★ ${workout.rating}`} />
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-8">
              <p className="text-[11px] font-bold uppercase tracking-[1px] text-[#C2F800]">
                HOW TO DO IT
              </p>

              <ol className="mt-4 space-y-4">
                {workout.instructions.slice(0, 4).map((instruction, index) => (
                  <li key={`${instruction}-${index}`} className="flex gap-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#374151] text-[11px] font-bold text-[#C2F800]">
                      {index + 1}
                    </span>

                    <p className="pt-1 text-[13px] leading-5 text-[#D1D5DB]">
                      {instruction}
                    </p>
                  </li>
                ))}
              </ol>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleAddToPlan}
                disabled={planCount >= 5}
                className="inline-flex h-11 flex-1 items-center justify-center rounded-lg bg-[#C2F800] px-5 text-[12px] font-bold text-[#0C0D10] transition hover:bg-[#CCFF00] disabled:cursor-not-allowed disabled:bg-[#252A31] disabled:text-[#6B7280]"
              >
                {planCount >= 5 ? "PLAN FULL" : "Add to today’s plan"}
              </button>

              <button
                type="button"
                onClick={handleSave}
                className={`inline-flex h-11 flex-1 items-center justify-center rounded-lg border px-5 text-[12px] font-bold transition ${
                  saved
                    ? "border-[#C2F800] bg-[#1A2312] text-[#C2F800]"
                    : "border-[#374151] bg-transparent text-[#E5E7EB] hover:bg-[#1A1D24]"
                }`}
              >
                {saved ? "SAVED" : "Save for later"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 left-4 right-4 z-50 rounded-xl border border-[#374151] bg-[#15171D] px-5 py-3 text-center text-sm text-white shadow-xl sm:left-1/2 sm:right-auto sm:-translate-x-1/2">
          {toast}
        </div>
      )}

      {/* Footer */}
      <Footer />
    </main>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-h-[48px] items-center justify-between gap-6 px-4 py-3 sm:px-5">
      <p className="text-[10px] font-medium uppercase tracking-[0.5px] text-[#6B7280] sm:text-[11px]">
        {label}
      </p>

      <p className="text-right text-[12px] font-medium text-[#E5E7EB] sm:text-[13px]">
        {value}
      </p>
    </div>
  );
}
