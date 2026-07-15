/**
 * Ink Dot Color Classes
 *
 * Maps InkType string names to Tailwind background classes for rendering
 * colored ink dots in replay cards. Mirrors the dot values from
 * match-history/ui/color-mask.ts but keyed by string instead of bitmask.
 */

export const INK_DOT_CLASSES: Record<string, string> = {
  amber: "bg-amber-400",
  amethyst: "bg-purple-400",
  emerald: "bg-emerald-400",
  ruby: "bg-red-400",
  sapphire: "bg-blue-400",
  steel: "bg-slate-400",
};

export function getInkDotClass(inkType: string): string {
  return INK_DOT_CLASSES[inkType] ?? "bg-slate-500";
}
