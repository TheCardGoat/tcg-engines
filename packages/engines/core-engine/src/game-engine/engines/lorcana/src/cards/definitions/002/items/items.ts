import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

const minimalItem = (
  id: string,
  name: string,
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
  set: "ROF",
  cost,
  colors,
  number: 0,
  illustrator: "",
  rarity: "common",
});

export const fangCrossbow = minimalItem(
  "fangCrossbow",
  "Fang Crossbow",
  ["emerald"],
  2,
);
export const pawpsicle = minimalItem("pawpsicle", "Pawpsicle", ["amber"], 1);
