import {
  evasiveAbility,
  vanishAbility,
} from "@lorcanito/lorcana-engine/abilities/abilities";
import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";

export const iagoGiantSpectralParrot: LorcanitoCharacterCard = {
  id: "dfk",
  name: "Iago",
  title: "Giant Spectral Parrot",
  characteristics: ["dreamborn", "ally", "illusion"],
  text: "Evasive\nVanish",
  type: "character",
  abilities: [vanishAbility, evasiveAbility],
  inkwell: true,
  colors: ["amethyst"],
  cost: 4,
  strength: 4,
  willpower: 6,
  illustrator: "John Loren / Nicholas Kole",
  number: 49,
  set: "007",
  rarity: "rare",
  lore: 1,
};
