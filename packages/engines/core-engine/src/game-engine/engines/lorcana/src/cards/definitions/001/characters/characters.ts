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
  set: "TFC",
  rarity: "common",
});

export const chiefTui = minimalChar(
  "chiefTui",
  "Chief Tui",
  "",
  ["amber"],
  3,
  3,
  4,
  1,
);
export const heiheiBoatSnack = minimalChar(
  "heiheiBoatSnack",
  "Heihei",
  "Boat Snack",
  ["amber"],
  1,
  1,
  2,
  1,
);
export const captainColonelsLieutenant = minimalChar(
  "captainColonelsLieutenant",
  "Captain",
  "Colonel's Lieutenant",
);
export const kuzcoTemperamentalEmperor = minimalChar(
  "kuzcoTemperamentalEmperor",
  "Kuzco",
  "Temperamental Emperor",
  ["emerald"],
  4,
  3,
  3,
  2,
);
export const liloGalacticHero = minimalChar(
  "liloGalacticHero",
  "Lilo",
  "Galactic Hero",
);
export const mauiDemiGod = minimalChar(
  "mauiDemiGod",
  "Maui",
  "Demi-God",
  ["ruby"],
  5,
  4,
  4,
  2,
);
export const stichtNewDog = minimalChar(
  "stichtNewDog",
  "Stitch",
  "New Dog",
  ["amethyst"],
  2,
  2,
  2,
  1,
);
export const minnieMouseBelovedPrincess = minimalChar(
  "minnieMouseBelovedPrincess",
  "Minnie Mouse",
  "Beloved Princess",
  ["amethyst"],
  3,
  2,
  3,
  2,
);
export const mickeyMouseDetective = minimalChar(
  "mickeyMouseDetective",
  "Mickey Mouse",
  "Detective",
  ["sapphire"],
  3,
  2,
  3,
  2,
);
export const megaraPullingTheStrings = minimalChar(
  "megaraPullingTheStrings",
  "Megara",
  "Pulling the Strings",
  ["emerald"],
  3,
  2,
  3,
  2,
);
export const donaldDuckStruttingHisStuff = minimalChar(
  "donaldDuckStruttingHisStuff",
  "Donald Duck",
  "Strutting His Stuff",
  ["sapphire"],
  3,
  2,
  3,
  2,
);
export const arielOnHumanLegs = minimalChar(
  "arielOnHumanLegs",
  "Ariel",
  "On Human Legs",
  ["amethyst"],
  2,
  2,
  2,
  1,
);
