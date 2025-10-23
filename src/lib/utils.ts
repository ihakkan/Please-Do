import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Priority } from "@/components/todo-list"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getPriorityStyles(priority: Priority) {
  switch (priority) {
    case "high":
      return "border-red-500/50 bg-red-500/10 text-red-400";
    case "medium":
      return "border-yellow-500/50 bg-yellow-500/10 text-yellow-400";
    case "low":
      return "border-green-500/50 bg-green-500/10 text-green-400";
    default:
      return "border-gray-500/50 bg-gray-500/10 text-gray-400";
  }
}
