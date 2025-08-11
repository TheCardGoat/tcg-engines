import type { LorcanaLocationCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

const minimalLocation = (
  id: string,
  name: string,
  moveCost = 1,
  lore = 1,
  colors: (
    | "amber"
    | "amethyst"
    | "emerald"
    | "ruby"
    | "sapphire"
    | "steel"
  )[] = ["amber"],
  cost = 1,
): LorcanaLocationCardDefinition => ({
  id,
  type: "location",
  name,
  characteristics: ["location"],
  set: "SSK",
  cost,
  colors,
  number: 0,
  illustrator: "",
  rarity: "common",
  moveCost,
  lore,
  title: "",
  willpower: 1,
});

export const prideLandsJungleOasis = minimalLocation(
  "prideLandsJungleOasis",
  "Pride Lands - Jungle Oasis",
  1,
  2,
  ["amber"],
  2,
);

export const theLibraryAGiftForBelle = minimalLocation(
  "theLibraryAGiftForBelle",
  "The Library - A Gift For Belle",
  1,
  0,
  ["sapphire"],
  2,
);
