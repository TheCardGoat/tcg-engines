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
  set: "ITI" | "ROF" | "SSK" = "ITI",
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
  set,
  rarity: "common",
});

export const starkeyDeviousPirate = minimalChar(
  "starkeyDeviousPirate",
  "Starkey",
  "Devious Pirate",
  ["ruby"],
  "ITI",
);
export const mrSmeeBumblingMate = minimalChar(
  "mrSmeeBumblingMate",
  "Mr. Smee",
  "Bumbling Mate",
  ["steel"],
  "ITI",
);
export const jimHawkinsSpaceTraveler = minimalChar(
  "jimHawkinsSpaceTraveler",
  "Jim Hawkins",
  "Space Traveler",
  ["sapphire"],
  "ITI",
);
// Disabled re-export to avoid path alias; minimal stand-ins above cover required names

export const dummy003Characters = {};
export const nalaFierceFriend = { id: "nalaFierceFriend" };
export const billyBonesKeeperOfTheMap = { id: "billyBonesKeeperOfTheMap" };
export const genieCrampedInTheLamp = { id: "genieCrampedInTheLamp" };
export const mickeyMouseTrumpeter = { id: "mickeyMouseTrumpeter" };
