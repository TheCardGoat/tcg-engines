import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
import { mauricesMachineAbility } from "~/game-engine/engines/lorcana/src/cards/definitions/007/abilities";

export const mauricesMachine: LorcanaItemCardDefinition = {
  id: "v7o",
  name: "Maurice's Machine",
  characteristics: ["item"],
  text: "BREAK DOWN When this item is banished, you may return an item card with cost 2 or less from your discard to your hand.",
  type: "item",
  abilities: [mauricesMachineAbility],
  inkwell: true,
  colors: ["ruby", "sapphire"],
  cost: 3,
  illustrator: "Isaiah Mesq",
  number: 151,
  set: "007",
  rarity: "uncommon",
};
