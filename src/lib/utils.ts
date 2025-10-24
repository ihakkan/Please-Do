
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Priority } from "@/components/todo-list"
import { isToday, isPast, isTomorrow } from "date-fns";

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

export function getDueDateStyles(dueDate: number | undefined, completed: boolean) {
  if (completed || !dueDate) {
    return {
      badge: "border-gray-500/50 bg-gray-800/50 text-gray-400",
      textColor: "text-gray-400",
    };
  }
  const date = new Date(dueDate);
  if (isPast(date) && !isToday(date)) {
    return {
      badge: "border-red-500/50 bg-red-900/50 text-red-300",
      textColor: "text-red-400",
    };
  }
  if (isToday(date)) {
    return {
      badge: "border-yellow-500/50 bg-yellow-900/50 text-yellow-300",
      textColor: "text-yellow-400",
    };
  }
  if (isTomorrow(date)) {
    return {
      badge: "border-blue-500/50 bg-blue-900/50 text-blue-300",
      textColor: "text-blue-400",
    };
  }
  return {
    badge: "border-gray-500/50 bg-gray-800/50 text-gray-400",
    textColor: "text-gray-400",
  };
}
