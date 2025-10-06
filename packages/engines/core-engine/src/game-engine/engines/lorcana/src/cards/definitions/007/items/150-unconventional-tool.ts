import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
import { unconventionalToolAbility } from "~/game-engine/engines/lorcana/src/cards/definitions/007/abilities";

export const unconventionalTool: LorcanaItemCardDefinition = {
  id: "xla",
  name: "Unconventional Tool",
  characteristics: ["item"],
  text: "FIXED IN NO TIME When this item is banished, you pay 2 {I} less for the next item you play this turn.",
  type: "item",
  abilities: [unconventionalToolAbility],
  inkwell: true,
  colors: ["ruby"],
  cost: 1,
  illustrator: "Levi Rogers",
  number: 150,
  set: "007",
  rarity: "common",
};
