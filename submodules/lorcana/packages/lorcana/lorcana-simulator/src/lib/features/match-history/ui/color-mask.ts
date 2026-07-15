export const INK_COLORS = {
  1: {
    label: "Amber",
    bg: "bg-amber-500",
    text: "text-amber-400",
    dot: "bg-amber-400",
    ink: "amber",
  },
  2: {
    label: "Amethyst",
    bg: "bg-purple-500",
    text: "text-purple-400",
    dot: "bg-purple-400",
    ink: "amethyst",
  },
  4: {
    label: "Emerald",
    bg: "bg-emerald-500",
    text: "text-emerald-400",
    dot: "bg-emerald-400",
    ink: "emerald",
  },
  8: { label: "Ruby", bg: "bg-red-500", text: "text-red-400", dot: "bg-red-400", ink: "ruby" },
  16: {
    label: "Sapphire",
    bg: "bg-blue-500",
    text: "text-blue-400",
    dot: "bg-blue-400",
    ink: "sapphire",
  },
  32: {
    label: "Steel",
    bg: "bg-slate-400",
    text: "text-slate-300",
    dot: "bg-slate-400",
    ink: "steel",
  },
} as const;

const INK_MASKS = [1, 2, 4, 8, 16, 32] as const;

export function getActiveInks(colorMask: number | null): (typeof INK_MASKS)[number][] {
  if (colorMask === null || colorMask === 0) return [];
  return INK_MASKS.filter((ink) => colorMask & ink);
}

export function formatColorMaskDots(colorMask: number | null): string {
  const inks = getActiveInks(colorMask);
  if (inks.length === 0) return "";
  return inks.map((ink) => INK_COLORS[ink].label.charAt(0)).join("");
}

export function getColorMaskLabel(colorMask: number | null): string {
  const inks = getActiveInks(colorMask);
  if (inks.length === 0) return "Unknown";
  return inks.map((ink) => INK_COLORS[ink].label).join("/");
}

export function isMultiInk(colorMask: number | null): boolean {
  const inks = getActiveInks(colorMask);
  return inks.length > 2;
}
