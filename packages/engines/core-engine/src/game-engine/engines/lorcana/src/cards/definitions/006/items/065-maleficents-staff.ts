import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
import { backFools } from "~/game-engine/engines/lorcana/src/cards/definitions/006/items/abilities";

export const maleficentsStaff: LorcanaItemCardDefinition = {
  id: "o37",
  name: "Maleficent's Staff",
  characteristics: ["item"],
  text: "BACK, FOOLS! Whenever one of your opponents' characters, items, or locations is returned to their hand from play, gain 1 lore.",
  type: "item",
  abilities: [backFools],
  inkwell: true,
  colors: ["amethyst"],
  cost: 2,
  illustrator: "Gabriel Angelo",
  number: 65,
  set: "006",
  rarity: "rare",
};
