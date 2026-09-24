import Link from "next/link";

import type { Workout } from "@/lib/fitlog";
import Image from "next/image";

export default function WorkoutCard({ workout }: { workout: Workout }) {
  return (
    <Link
      href={`/workout/${workout.id}`}
      className="group overflow-hidden rounded-2xl border border-[#222630] bg-[#15171D] transition hover:border-[#374151]"
    >
      <div className="relative h-[190px] overflow-hidden bg-[#171A21] sm:h-[192px]">
        <Image
          src={workout.image}
          alt={workout.name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
        />

        <div className="absolute left-4 top-4 flex max-w-[calc(100%-32px)] flex-wrap gap-2 sm:left-5 sm:top-5">
          {workout.muscleGroups.map((muscle) => (
            <span
              key={muscle}
              className="rounded-full bg-[#C2F800] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.55px] text-[#0C0D10] sm:text-[11px]"
            >
              {muscle}
            </span>
          ))}
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <h3 className="font-['Oswald'] text-[18px] font-bold leading-7 tracking-[0.45px]">
          {workout.name.toUpperCase()}
        </h3>

        <p className="mt-1 text-[12px] leading-4 text-[#9CA3AF]">
          {workout.equipment}
        </p>

        <div className="my-5 h-px bg-[#222630]" />

        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <WorkoutStat label="Duration" value={`${workout.duration} min`} />

          <WorkoutStat
            label="Calories"
            value={`${workout.caloriesBurned} kcal`}
          />

          <WorkoutStat label="Rating" value={`★ ${workout.rating}`} />
        </div>
      </div>
    </Link>
  );
}

function WorkoutStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="truncate text-[10px] uppercase text-[#6B7280] sm:text-[11px]">
        {label}
      </p>

      <p className="mt-1 truncate text-[11px] text-[#E5E7EB] sm:text-[12px]">
        {value}
      </p>
    </div>
  );
}
