import { handleWithCare } from "~/game-engine/engines/lorcana/src/cards/definitions/006/items/abilities";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const trainingDummy: LorcanaItemCardDefinition = {
  id: "r2x",
  missingTestCase: true,
  name: "Training Dummy",
  characteristics: ["item"],
  text: "HANDLE WITH CARE {E}, 2 {I} – Chosen character gains Bodyguard until the start of your next turn. (An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
  type: "item",
  abilities: [handleWithCare],
  inkwell: true,
  colors: ["steel"],
  cost: 2,
  illustrator: "Valentina Grzbuso",
  number: 201,
  set: "006",
  rarity: "uncommon",
};
