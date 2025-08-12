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
  set: "URR",
  rarity: "common",
});

export const cinderellaMelodyWeaver = minimalChar(
  "cinderellaMelodyWeaver",
  "Cinderella",
  "Melody Weaver",
  ["sapphire"],
  3,
  2,
  3,
  2,
);
export const rayaFierceProtector = minimalChar(
  "rayaFierceProtector",
  "Raya",
  "Fierce Protector",
  ["emerald"],
  4,
  3,
  3,
  2,
);
export const aladdinBraveRescuer = minimalChar(
  "aladdinBraveRescuer",
  "Aladdin",
  "Brave Rescuer",
  ["emerald"],
  3,
  3,
  3,
  2,
);
export const aladdinResoluteSwordsman = minimalChar(
  "aladdinResoluteSwordsman",
  "Aladdin",
  "Resolute Swordsman",
  ["ruby"],
  4,
  3,
  3,
  2,
);
export const argesTheCyclops = minimalChar(
  "argesTheCyclops",
  "Arges",
  "The Cyclops",
  ["ruby"],
  5,
  5,
  5,
  2,
);
export const herculesBelovedHero = minimalChar(
  "herculesBelovedHero",
  "Hercules",
  "Beloved Hero",
  ["ruby"],
  5,
  5,
  5,
  2,
);
export const sisuEmboldenedWarrior = minimalChar(
  "sisuEmboldenedWarrior",
  "Sisu",
  "Emboldened Warrior",
  ["sapphire"],
  4,
  3,
  4,
  2,
);
export const daisyDuckLovelyLady = minimalChar(
  "daisyDuckLovelyLady",
  "Daisy Duck",
  "Lovely Lady",
  ["sapphire"],
  2,
  2,
  2,
  1,
);
export const faZhouMulansFather = minimalChar(
  "faZhouMulansFather",
  "Fa Zhou",
  "Mulan's Father",
  ["amber"],
  2,
  1,
  2,
  1,
);
export const flynnRiderFrenemy = minimalChar(
  "flynnRiderFrenemy",
  "Flynn Rider",
  "Frenemy",
  ["emerald"],
  3,
  2,
  3,
  1,
);
export const goofySuperGoof = minimalChar(
  "goofySuperGoof",
  "Goofy",
  "Super Goof",
  ["ruby"],
  4,
  3,
  4,
  2,
);
export const rapunzelAppreciativeArtist = minimalChar(
  "rapunzelAppreciativeArtist",
  "Rapunzel",
  "Appreciative Artist",
  ["amber"],
  3,
  2,
  3,
  2,
);
export const peteBornToCheat = minimalChar(
  "peteBornToCheat",
  "Pete",
  "Born To Cheat",
  ["ruby"],
  4,
  3,
  3,
  2,
);
export const magicBroomLivelySweeper = minimalChar(
  "magicBroomLivelySweeper",
  "Magic Broom",
  "Lively Sweeper",
  ["amethyst"],
  2,
  1,
  2,
  1,
);

export const sisuEmpoweredSibling = minimalChar(
  "sisuEmpoweredSibling",
  "Sisu",
  "Empowered Sibling",
  ["sapphire"],
  4,
  3,
  4,
  2,
);
// Disabled external re-export to avoid path alias; tests rely on local minimal names instead

// keep only minimal definition above
export const donaldDuckBuccaneer = { id: "donaldDuckBuccaneer" };
export const peterPanShadowFinder = { id: "peterPanShadowFinder" };
export const agustinMadrigalClumsyDad = { id: "agustinMadrigalClumsyDad" };
export const almaMadrigalFamilyMatriarch = {
  id: "almaMadrigalFamilyMatriarch",
};
export const mickeyMouseLeaderOfTheBand = { id: "mickeyMouseLeaderOfTheBand" };
