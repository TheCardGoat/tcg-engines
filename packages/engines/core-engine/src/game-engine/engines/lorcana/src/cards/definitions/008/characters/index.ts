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
  set: "008",
  rarity: "common",
});

export const mickeyMouseGiantMouse = minimalChar(
  "mickeyMouseGiantMouse",
  "Mickey Mouse",
  "Giant Mouse",
  ["ruby"],
  4,
  3,
  3,
  2,
);
export const deweyLovableShowoff = minimalChar(
  "deweyLovableShowoff",
  "Dewey",
  "Lovable Showoff",
  ["sapphire"],
  2,
  1,
  2,
  1,
);
export const khanWarHorse = minimalChar(
  "khanWarHorse",
  "Khan",
  "War Horse",
  ["steel"],
  3,
  2,
  3,
  1,
);
export const tianaNaturalTalent = minimalChar(
  "tianaNaturalTalent",
  "Tiana",
  "Natural Talent",
  ["amber"],
  3,
  2,
  3,
  2,
);
export const generalLiHeadOfTheImperialArmy = minimalChar(
  "generalLiHeadOfTheImperialArmy",
  "General Li",
  "Head Of The Imperial Army",
  ["steel"],
  4,
  3,
  4,
  2,
);
export const jumbaJookibaCriticalScientist = minimalChar(
  "jumbaJookibaCriticalScientist",
  "Jumba Jookiba",
  "Critical Scientist",
  ["amethyst"],
  4,
  3,
  3,
  2,
);
export const dalmatianPuppyTailWagger = minimalChar(
  "dalmatianPuppyTailWagger",
  "Dalmatian Puppy",
  "Tail Wagger",
  ["amber"],
  1,
  1,
  1,
  1,
);
export const puaProtectivePig = minimalChar(
  "puaProtectivePig",
  "Pua",
  "Protective Pig",
  ["amber"],
  1,
  1,
  2,
  1,
);
export const patchPlayfulPup = minimalChar(
  "patchPlayfulPup",
  "Patch",
  "Playful Pup",
  ["amber"],
  2,
  1,
  2,
  1,
);

// Additional 008 characters referenced by tests (minimal stubs)
// keep single definition block below to avoid duplicates
// (removed duplicate minimal stubs below)

// Additional 008 characters referenced by tests (single definitive block)
// removed duplicate honeyLemonCostumedCatalyst defined below
export const fredMajorScienceEnthusiast = minimalChar(
  "fredMajorScienceEnthusiast",
  "Fred",
  "Major Science Enthusiast",
  ["ruby"],
  3,
  2,
  3,
  2,
);
export const louisEndearingAlligator = minimalChar(
  "louisEndearingAlligator",
  "Louis",
  "Endearing Alligator",
  ["amber"],
  4,
  3,
  4,
  2,
);
export const madDogKarnagesFirstMate = minimalChar(
  "madDogKarnagesFirstMate",
  "Mad Dog",
  "Karnage's First Mate",
  ["steel"],
  3,
  3,
  3,
  2,
);
export const napoleonCleverBloodhound = minimalChar(
  "napoleonCleverBloodhound",
  "Napoleon",
  "Clever Bloodhound",
  ["amber"],
  2,
  1,
  2,
  1,
);

// Minimal stub for tests referencing Honey Lemon (008-111)
export const honeyLemonCostumedCatalyst = minimalChar(
  "honeyLemonCostumedCatalyst",
  "Honey Lemon",
  "Costumed Catalyst",
  ["emerald", "sapphire"],
  4,
  3,
  3,
  2,
);
