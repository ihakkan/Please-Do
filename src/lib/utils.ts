import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Priority } from "@/components/todo-list"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getPriorityStyles(priority: Priority) {
  switch (priority) {
    case "high":
      return "border-red-500/50 bg-red-900/50 text-red-300";
    case "medium":
      return "border-yellow-500/50 bg-yellow-900/50 text-yellow-300";
    case "low":
      return "border-green-500/50 bg-green-900/50 text-green-300";
    default:
      return "border-gray-500/50 bg-gray-800/50 text-gray-400";
  }
}
