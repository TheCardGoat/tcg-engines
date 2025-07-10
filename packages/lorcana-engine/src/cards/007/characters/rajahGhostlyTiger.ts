import { vanishAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";

export const rajahGhostlyTiger: LorcanitoCharacterCard = {
  id: "yk7",
  name: "Rajah",
  title: "Ghostly Tiger",
  characteristics: ["dreamborn", "ally", "illusion"],
  text: "Vanish",
  type: "character",
  abilities: [vanishAbility],
  inkwell: true,
  colors: ["amethyst"],
  cost: 2,
  strength: 3,
  willpower: 3,
  illustrator: "Andrea Femerstrand",
  number: 62,
  set: "007",
  rarity: "common",
  lore: 1,
};
