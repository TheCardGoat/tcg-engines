import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const royalGuardBovineProtector: LorcanaCharacterCardDefinition = {
  id: "dua",
  name: "Royal Guard",
  title: "Bovine Protector",
  characteristics: ["storyborn"],
  type: "character",
  flavour: "Hey, I’ve been turned into a cow. Can I go home?",
  inkwell: true,
  colors: ["steel"],
  cost: 4,
  strength: 1,
  willpower: 7,
  lore: 1,
  illustrator: "Valerio Buonfantino",
  number: 175,
  set: "SSK",
  rarity: "common",
};
