import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
import { faithAndTrust } from "~/game-engine/engines/lorcana/src/cards/definitions/006/items/abilities";

export const pixieDust: LorcanaItemCardDefinition = {
  id: "t1s",
  missingTestCase: true,
  name: "Pixie Dust",
  characteristics: ["item"],
  text: "FAITH AND TRUST {E}, {2} {I} - Chosen character gains Challenger +2 and Evasive until the start of your next turn. (While challenging, they get +2 {1}. Only characters with Evasive can challenge them.)",
  type: "item",
  abilities: [faithAndTrust],
  inkwell: false,
  colors: ["amethyst"],
  cost: 4,
  illustrator: "Ellie Horie / Mara Tango",
  number: 67,
  set: "006",
  rarity: "uncommon",
};
