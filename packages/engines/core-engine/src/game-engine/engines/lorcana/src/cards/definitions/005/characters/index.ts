import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

const minimalChar = (
  id: string,
  name: string,
  title: string,
  colors: (
    | "amber"
    | "amethyst"
    | "emerald"
    | "ruby"
    | "sapphire"
    | "steel"
  )[] = ["amber"],
  cost = 1,
  strength = 1,
  willpower = 1,
  lore = 1,
): LorcanaCharacterCardDefinition => ({
  id,
  type: "character",
  name,
  title,
  characteristics: ["storyborn"],
  inkwell: true,
  colors,
  cost,
  strength,
  willpower,
  lore,
  illustrator: "",
  number: 0,
  set: "SSK",
  rarity: "common",
});

export const tipoGrowingSon = minimalChar(
  "tipoGrowingSon",
  "Tipo",
  "Growing Son",
  ["amber"],
  2,
  2,
  2,
  1,
);
export const mickeyMouseFoodFightDefender = minimalChar(
  "mickeyMouseFoodFightDefender",
  "Mickey Mouse",
  "Food Fight Defender",
  ["ruby"],
  3,
  3,
  3,
  2,
);
export const simbaAdventurousSuccessor = minimalChar(
  "simbaAdventurousSuccessor",
  "Simba",
  "Adventurous Successor",
  ["amber"],
  3,
  3,
  3,
  2,
);
export const vanellopeVonSchweetzSugarRushChamp = minimalChar(
  "vanellopeVonSchweetzSugarRushChamp",
  "Vanellope Von Schweetz",
  "Sugar Rush Champ",
  ["ruby"],
  3,
  2,
  3,
  2,
);
export const vanellopeVonSchweetzSugarRushPrincess = minimalChar(
  "vanellopeVonSchweetzSugarRushPrincess",
  "Vanellope Von Schweetz",
  "Sugar Rush Princess",
  ["ruby"],
  3,
  2,
  3,
  2,
);
