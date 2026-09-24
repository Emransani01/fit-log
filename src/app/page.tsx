"use client";

import { useEffect, useState } from "react";

import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import WorkoutCard from "@/components/WorkoutCard";
import type { Workout } from "@/lib/fitlog";

export default function Home() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadWorkouts = async () => {
      try {
        const response = await fetch(
          "https://api.abcz.workers.dev/api/fitlog"
        );

        if (!response.ok) {
          throw new Error("Failed to load workouts");
        }

        const data: Workout[] = await response.json();

        setWorkouts(data);
      } catch {
        setError("Unable to load workouts right now.");
      } finally {
        setLoading(false);
      }
    };

    loadWorkouts();
  }, []);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0C0D10] text-white">
      <Navbar />

      <Hero />

      <section
        id="library"
        className="px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-14"
      >
        <div className="mx-auto max-w-[1232px]">
          <div className="mb-7 sm:mb-8">
            <h2 className="font-['Oswald'] text-[28px] font-bold leading-9 tracking-[-0.75px] sm:text-[30px]">
              THE LIBRARY
            </h2>

            <p className="mt-2 text-[13px] leading-5 text-[#9CA3AF] sm:text-[14px]">
              Twelve lifts covering every major muscle group.
            </p>
          </div>

          {loading && (
            <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-[#222630] bg-[#15171D]">
              <p className="text-[14px] text-[#9CA3AF]">
                Loading workouts…
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-[#222630] bg-[#15171D]">
              <p className="px-6 text-center text-[14px] text-[#9CA3AF]">
                {error}
              </p>
            </div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {workouts.map((workout) => (
                <WorkoutCard
                  key={workout.id}
                  workout={workout}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}