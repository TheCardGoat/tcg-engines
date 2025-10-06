import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
import { amberCoilAbility } from "~/game-engine/engines/lorcana/src/cards/definitions/007/abilities";

export const amberCoil: LorcanaItemCardDefinition = {
  id: "e7x",
  name: "Amber Coil",
  characteristics: ["item"],
  text: "HEALING AURA During your turn, whenever a card is put into your inkwell, you may remove up to 2 damage from chosen character.",
  type: "item",
  abilities: [amberCoilAbility],
  inkwell: true,
  colors: ["amber"],
  cost: 1,
  illustrator: "Francesco Colucci",
  number: 41,
  set: "007",
  rarity: "uncommon",
};
