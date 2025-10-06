import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
import { steelCoilAbility } from "~/game-engine/engines/lorcana/src/cards/definitions/007/abilities";

export const steelCoil: LorcanaItemCardDefinition = {
  id: "p3u",
  name: "Steel Coil",
  characteristics: ["item"],
  text: "METALLIC FLOW During your turn, whenever a card is put into your inkwell, you may draw a card, then choose and discard a card.",
  type: "item",
  abilities: [steelCoilAbility],
  inkwell: false,
  colors: ["steel"],
  cost: 2,
  illustrator: "Francesco Colucci",
  number: 203,
  set: "007",
  rarity: "uncommon",
};
