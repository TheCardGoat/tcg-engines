import { wakeUpAliceAbility } from "~/game-engine/engines/lorcana/src/cards/definitions/007/abilities";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export type LorcanaActionCardDefinition = any;

export const wakeUpAlice: LorcanaActionCardDefinition = {
  id: "a3c",
  name: "Wake Up, Alice!",
  characteristics: ["action"],
  text: "Return chosen damaged character to their player's hand.",
  type: "action",
  abilities: [wakeUpAliceAbility],
  inkwell: true,
  colors: ["emerald"],
  cost: 1,
  illustrator: "Valentina Graziano",
  number: 116,
  set: "007",
  rarity: "common",
};
