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
  set: "URR",
  cost,
  colors,
  number: 0,
  illustrator: "",
  rarity: "common",
});

export const iceBlock = minimalItem("iceBlock", "Ice Block", ["sapphire"], 1);
