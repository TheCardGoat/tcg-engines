import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

const minimalItem = (
  id: string,
  name: string,
  set: "ITI" | "SSK" | "ROF" = "ITI",
  colors: (
    | "amber"
    | "amethyst"
    | "emerald"
    | "ruby"
    | "sapphire"
    | "steel"
  )[] = ["amber"],
  cost = 1,
): LorcanaItemCardDefinition => ({
  id,
  type: "item",
  name,
  characteristics: ["item"],
  set,
  cost,
  colors,
  number: 0,
  illustrator: "",
  rarity: "common",
});

export const cleansingRainwater = minimalItem(
  "cleansingRainwater",
  "Cleansing Rainwater",
);
export const fishboneQuill = minimalItem(
  "fishboneQuill",
  "Fishbone Quill",
  "TFC",
  ["amethyst"],
  1,
);
