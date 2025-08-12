import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mickeyBraveLittleTailor: LorcanaCharacterCardDefinition = {
  id: "mickeyBraveLittleTailor",
  type: "character",
  name: "Mickey Mouse",
  title: "Brave Little Tailor",
  characteristics: ["hero", "dreamborn"],
  inkwell: true,
  colors: ["ruby"],
  cost: 8,
  strength: 5,
  willpower: 5,
  lore: 4,
  illustrator: "",
  number: 115,
  set: "TFC",
  rarity: "legendary",
};

// Minimal character stand-ins used by tests
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

export const moanaOfMotunui = minimalChar(
  "moanaOfMotunui",
  "Moana",
  "Of Motunui",
  ["amber"],
  3,
  2,
  3,
  1,
);
export const liloMakingAWish = minimalChar(
  "liloMakingAWish",
  "Lilo",
  "Making a Wish",
  ["amber"],
  2,
  1,
  2,
  1,
);
export const mickeyMouseTrueFriend = minimalChar(
  "mickeyMouseTrueFriend",
  "Mickey Mouse",
  "True Friend",
  ["ruby"],
  3,
  2,
  2,
  2,
);
export const magicBroomBucketBrigade = minimalChar(
  "magicBroomBucketBrigade",
  "Magic Broom",
  "Bucket Brigade",
  ["amethyst"],
  1,
  1,
  1,
  1,
);
export const teKaTheBurningOne = minimalChar(
  "teKaTheBurningOne",
  "Te Ka",
  "The Burning One",
  ["ruby"],
  6,
  5,
  5,
  2,
);
export const aladdinHeroicOutlaw = minimalChar(
  "aladdinHeroicOutlaw",
  "Aladdin",
  "Heroic Outlaw",
  ["emerald"],
  4,
  3,
  3,
  2,
);
export const arielSpectacularSinger = minimalChar(
  "arielSpectacularSinger",
  "Ariel",
  "Spectacular Singer",
  ["amethyst"],
  3,
  2,
  3,
  2,
);
export const mrSmee = minimalChar(
  "mrSmee",
  "Mr. Smee",
  " ",
  ["steel"],
  2,
  2,
  2,
  1,
);
export const mickeyMouseArtfulRogue = minimalChar(
  "mickeyMouseArtfulRogue",
  "Mickey Mouse",
  "Artful Rogue",
  ["emerald"],
  4,
  3,
  3,
  2,
);
export const donaldDuck = minimalChar(
  "donaldDuck",
  "Donald Duck",
  " ",
  ["sapphire"],
  2,
  2,
  2,
  1,
);
export const tamatoaDrabLittleCrab = minimalChar(
  "tamatoaDrabLittleCrab",
  "Tamatoa",
  "Drab Little Crab",
  ["ruby"],
  2,
  2,
  2,
  1,
);
export const simbaProtectiveCub = minimalChar(
  "simbaProtectiveCub",
  "Simba",
  "Protective Cub",
  ["amber"],
  1,
  1,
  2,
  1,
);
export const goonsMaleficent = minimalChar(
  "goonsMaleficent",
  "Goons",
  "Maleficent",
  ["amethyst"],
  2,
  2,
  2,
  1,
);
export const genieTheEverImpressive = minimalChar(
  "genieTheEverImpressive",
  "Genie",
  "The Ever Impressive",
  ["amethyst"],
  5,
  4,
  4,
  2,
);
export const dukeOfWeselton = minimalChar(
  "dukeOfWeselton",
  "Duke of Weselton",
  " ",
  ["steel"],
  2,
  2,
  2,
  1,
);
export const cruellaDeVilMiserableAsUsual = minimalChar(
  "cruellaDeVilMiserableAsUsual",
  "Cruella de Vil",
  "Miserable As Usual",
  ["emerald"],
  3,
  2,
  3,
  2,
);
export const mickeyMouseMusketeer = minimalChar(
  "mickeyMouseMusketeer",
  "Mickey Mouse",
  "Musketeer",
  ["steel"],
  4,
  3,
  4,
  2,
);

// Additional characters referenced by tests
export const chiefTui = minimalChar(
  "chiefTui",
  "Chief Tui",
  " ",
  ["amber"],
  3,
  2,
  3,
  2,
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
  ["steel"],
  2,
  2,
  2,
  1,
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
export const mauiHeroToAll = minimalChar(
  "mauiHeroToAll",
  "Maui",
  "Hero to All",
  ["ruby"],
  4,
  4,
  3,
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
export const tiggerWonderfulThing = minimalChar(
  "tiggerWonderfulThing",
  "Tigger",
  "Wonderful Thing",
  ["amber"],
  3,
  3,
  3,
  2,
);
export const arielOnHumanLegs = minimalChar(
  "arielOnHumanLegs",
  "Ariel",
  "On Human Legs",
  ["amethyst"],
  3,
  2,
  2,
  2,
);
export const mickeyMouseDetective = minimalChar(
  "mickeyMouseDetective",
  "Mickey Mouse",
  "Detective",
  ["emerald"],
  3,
  2,
  3,
  2,
);
export const minnieMouseBelovedPrincess = minimalChar(
  "minnieMouseBelovedPrincess",
  "Minnie Mouse",
  "Beloved Princess",
  ["amethyst"],
  2,
  2,
  2,
  1,
);
export const megaraPullingTheStrings = minimalChar(
  "megaraPullingTheStrings",
  "Megara",
  "Pulling the Strings",
  ["amethyst"],
  4,
  3,
  3,
  2,
);
export const maleficentMonstrousDragon = minimalChar(
  "maleficentMonstrousDragon",
  "Maleficent",
  "Monstrous Dragon",
  ["ruby"],
  7,
  6,
  6,
  3,
);
export const liloGalacticHero = minimalChar(
  "liloGalacticHero",
  "Lilo",
  "Galactic Hero",
  ["amber"],
  4,
  3,
  3,
  2,
);
