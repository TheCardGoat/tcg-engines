import { aSuitableWeapon } from "~/game-engine/engines/lorcana/src/cards/definitions/006/items/abilities";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const cardSoldiersSpear: LorcanaItemCardDefinition = {
  id: "bka",
  missingTestCase: true,
  name: "Card Soldier's Spear",
  characteristics: ["item"],
  text: "A SUITABLE WEAPON Your damaged characters get +1 {S}.",
  type: "item",
  abilities: [aSuitableWeapon],
  inkwell: true,
  colors: ["ruby"],
  cost: 1,
  illustrator: "Kristen Kuloba",
  number: 134,
  set: "006",
  rarity: "uncommon",
};
