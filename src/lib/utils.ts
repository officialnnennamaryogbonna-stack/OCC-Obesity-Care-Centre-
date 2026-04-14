import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateBMI(weight: number, height: number): { score: number; category: string; color: string } {
  if (!weight || !height) return { score: 0, category: "Unknown", color: "text-gray-400" };
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  const score = parseFloat(bmi.toFixed(1));

  if (score < 18.5) return { score, category: "Underweight", color: "text-blue-500" };
  if (score < 25) return { score, category: "Healthy weight", color: "text-green-500" };
  if (score < 30) return { score, category: "Overweight", color: "text-yellow-500" };
  return { score, category: "Obesity", color: "text-red-500" };
}
