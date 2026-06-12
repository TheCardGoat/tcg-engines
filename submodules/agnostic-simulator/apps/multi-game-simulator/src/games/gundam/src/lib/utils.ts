import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge class names with conflict resolution.
 *
 * `cn()` accepts the same inputs as `clsx` and then runs the result through
 * `tailwind-merge` so the LAST utility wins when callers layer overrides on
 * top of default component classes (e.g. `<Button className="bg-hud-danger">`
 * overrides the variant's `bg-hud-accent`).
 *
 * Canonical shadcn-style helper; shared across every primitive.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
