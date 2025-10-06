import { vanishAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/vanishAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const rajahGhostlyTiger: LorcanaCharacterCardDefinition = {
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
