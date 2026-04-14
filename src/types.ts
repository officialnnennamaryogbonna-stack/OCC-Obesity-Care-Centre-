export type Gender = "male" | "female" | "other";
export type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "very_active";
export type FitnessLevel = "beginner" | "intermediate" | "advanced";
export type DietaryPreference = "none" | "vegetarian" | "vegan" | "keto" | "low-carb" | "high-protein";
export type HealthGoal = "habits" | "activity" | "consistency" | "weight-loss" | "maintain";

export interface Gym {
  id: string;
  name: string;
  address: string;
  area: string;
  phone: string;
  hours: string;
  description: string;
  lat: number;
  lng: number;
  tags: string[];
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: number;
  reactions: { [key: string]: number };
  replies?: ChatMessage[];
}

export interface UserProfile {
  name: string;
  age: number;
  height: number; // cm
  weight: number; // kg
  gender: Gender;
  activityLevel: ActivityLevel;
  fitnessLevel: FitnessLevel;
  dietaryPreference: DietaryPreference;
  mainGoal: HealthGoal;
  reminderPreferences: {
    water: boolean;
    meals: boolean;
    exercise: boolean;
    sleep: boolean;
    checkins: boolean;
  };
  points: number;
  badges: string[];
  onboarded: boolean;
  offlineMode: boolean;
}

export interface Meal {
  id: string;
  name: string;
  calories: number;
  ingredients: string[];
  instructions: string;
  tags: string[];
  type: "breakfast" | "lunch" | "dinner" | "snack";
  image?: string;
}

export interface Workout {
  id: string;
  title: string;
  duration: number; // minutes
  difficulty: FitnessLevel;
  caloriesBurned: number;
  instructions: string[];
  type: "home" | "gym" | "walking" | "stretching" | "low-impact";
  image?: string;
}

export interface DailyLog {
  date: string;
  weight: number;
  waterIntake: number; // glasses
  caloriesConsumed: number;
  caloriesBurned: number;
  steps: number;
  workoutCompleted: boolean;
  mealsLogged: string[];
  mood?: string;
  habits: { [key: string]: boolean };
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  participants: number;
  points: number;
  icon: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}
