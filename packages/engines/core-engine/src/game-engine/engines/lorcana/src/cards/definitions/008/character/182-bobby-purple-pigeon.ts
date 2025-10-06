import { bodyguardAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/bodyguardAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const bobbyPurplePigeon: LorcanaCharacterCardDefinition = {
  id: "hms",
  name: "Bobby",
  title: "Purple Pigeon",
  characteristics: ["storyborn"],
  text: "Bodyguard",
  type: "character",
  abilities: [bodyguardAbility],
  inkwell: true,
  colors: ["steel"],
  cost: 3,
  strength: 4,
  willpower: 2,
  illustrator: "Adam Fenton",
  number: 182,
  set: "008",
  rarity: "common",
  lore: 1,
};
