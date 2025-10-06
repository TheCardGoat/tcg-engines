import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
import { emeraldCoilAbility } from "~/game-engine/engines/lorcana/src/cards/definitions/007/abilities";

export const emeraldCoil: LorcanaItemCardDefinition = {
  id: "mry",
  name: "Emerald Coil",
  characteristics: ["item"],
  text: "SHIMMERING WINGS During your turn, whenever a card is put into your inkwell, chosen character gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)",
  type: "item",
  abilities: [emeraldCoilAbility],
  inkwell: false,
  colors: ["emerald"],
  cost: 3,
  illustrator: "Francesco Colucci",
  number: 120,
  set: "007",
  rarity: "uncommon",
};
