export type Workout = {
  id: number;
  name: string;
  image: string;
  muscleGroups: string[];
  equipment: string;
  difficulty: string;
  duration: number;
  caloriesBurned: number;
  sets: number;
  reps: string;
  rating: number;
  description: string;
  instructions: string[];
};

const PLAN_KEY = "fitlog-plan";
const SAVED_KEY = "fitlog-saved";

function readStorage(key: string): Workout[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = localStorage.getItem(key);

    if (!stored) {
      return [];
    }

    return JSON.parse(stored);
  } catch {
    return [];
  }
}

function writeStorage(key: string, workouts: Workout[]) {
  localStorage.setItem(key, JSON.stringify(workouts));

  window.dispatchEvent(
    new CustomEvent("fitlog-storage-update", {
      detail: {
        key,
      },
    }),
  );
}

export function getPlan(): Workout[] {
  return readStorage(PLAN_KEY);
}

export function getSaved(): Workout[] {
  return readStorage(SAVED_KEY);
}

export function addToPlan(workout: Workout): {
  success: boolean;
  message: string;
} {
  const plan = getPlan();

  const alreadyAdded = plan.some((item) => item.id === workout.id);

  if (alreadyAdded) {
    return {
      success: false,
      message: "This workout is already in today’s plan.",
    };
  }

  if (plan.length >= 5) {
    return {
      success: false,
      message: "Today’s plan is full. You can add up to 5 lifts.",
    };
  }

  const updatedPlan = [...plan, workout];

  writeStorage(PLAN_KEY, updatedPlan);

  return {
    success: true,
    message: "Added to today’s plan.",
  };
}

export function removeFromPlan(id: number) {
  const plan = getPlan();

  const updatedPlan = plan.filter((workout) => workout.id !== id);

  writeStorage(PLAN_KEY, updatedPlan);
}

export function saveForLater(workout: Workout): {
  success: boolean;
  message: string;
} {
  const saved = getSaved();

  const alreadySaved = saved.some((item) => item.id === workout.id);

  if (alreadySaved) {
    return {
      success: false,
      message: "This workout is already saved.",
    };
  }

  const updatedSaved = [...saved, workout];

  writeStorage(SAVED_KEY, updatedSaved);

  return {
    success: true,
    message: "Saved for later.",
  };
}

export function removeFromSaved(id: number) {
  const saved = getSaved();

  const updatedSaved = saved.filter((workout) => workout.id !== id);

  writeStorage(SAVED_KEY, updatedSaved);
}
