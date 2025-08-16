import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names using clsx and merges Tailwind classes using twMerge.
 * @param {...any} inputs - Class names or arrays of class names.
 * @returns {string} - Merged class name string.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
