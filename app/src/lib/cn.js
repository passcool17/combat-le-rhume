import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Combine des classes Tailwind (les dernières l’emportent en cas de conflit). */
export function cn(...classes) {
  return twMerge(clsx(classes));
}
