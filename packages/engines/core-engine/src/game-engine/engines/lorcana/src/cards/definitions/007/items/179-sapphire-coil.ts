import { sapphireCoilAbility } from "~/game-engine/engines/lorcana/src/cards/definitions/007/abilities";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const sapphireCoil: LorcanaItemCardDefinition = {
  id: "xyq",
  name: "Sapphire Coil",
  characteristics: ["item"],
  text: "BRILLIANT SHINE During your turn, whenever a card is put into your inkwell, you may give chosen character -2 {S} this turn.",
  type: "item",
  abilities: [sapphireCoilAbility],
  inkwell: true,
  colors: ["sapphire"],
  cost: 2,
  illustrator: "Francesco Colucci",
  number: 179,
  set: "007",
  rarity: "uncommon",
};
