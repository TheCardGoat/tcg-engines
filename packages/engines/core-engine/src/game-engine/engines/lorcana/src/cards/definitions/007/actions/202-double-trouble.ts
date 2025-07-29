import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
import { doubleTroubleAbility } from "~/game-engine/engines/lorcana/src/cards/definitions/007/abilities";

export const doubleTrouble: LorcanaActionCardDefinition = {
  id: "kxb",
  name: "Double Trouble",
  characteristics: ["action"],
  text: "Deal 1 damage to up to 2 chosen characters.",
  type: "action",
  abilities: [doubleTroubleAbility],
  inkwell: true,
  colors: ["steel"],
  cost: 2,
  illustrator: "Natalie Dombois",
  number: 202,
  set: "007",
  rarity: "uncommon",
};
