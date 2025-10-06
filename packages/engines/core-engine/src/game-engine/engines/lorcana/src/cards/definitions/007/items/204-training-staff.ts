import { trainingStaffAbility } from "~/game-engine/engines/lorcana/src/cards/definitions/007/abilities";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const trainingStaff: LorcanaItemCardDefinition = {
  id: "lxr",
  name: "Training Staff",
  characteristics: ["item"],
  text: "PRECISION STRIKE {E}, 1 {I} – Chosen character gains Challenger +2 this turn. (They get +2 {S} while challenging.)",
  type: "item",
  abilities: [trainingStaffAbility],
  inkwell: true,
  colors: ["steel"],
  cost: 2,
  illustrator: "Roberto Gatto",
  number: 204,
  set: "007",
  rarity: "super_rare",
};
