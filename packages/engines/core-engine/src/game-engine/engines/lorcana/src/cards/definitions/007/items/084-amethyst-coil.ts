import { amethystCoilAbility } from "~/game-engine/engines/lorcana/src/cards/definitions/007/abilities";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const amethystCoil: LorcanaItemCardDefinition = {
  id: "sw5",
  name: "Amethyst Coil",
  characteristics: ["item"],
  type: "item",
  inkwell: false,
  colors: ["amethyst"],
  cost: 3,
  illustrator: "Francesco Colucci",
  number: 84,
  set: "007",
  rarity: "uncommon",
  text: "MAGICAL TOUCH During your turn, whenever a card is put into your inkwell, you may move 1 damage counter from chosen character to chosen opposing character.",
  abilities: [amethystCoilAbility],
};
