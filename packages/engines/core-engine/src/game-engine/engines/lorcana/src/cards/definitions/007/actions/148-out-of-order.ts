import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
import { outOfOrderAbility } from "~/game-engine/engines/lorcana/src/cards/definitions/007/abilities";

export type LorcanaActionCardDefinition = any;

export const outOfOrder: LorcanaActionCardDefinition = {
  id: "hvy",
  name: "Out Of Order",
  characteristics: ["action"],
  text: "Banish chosen character.",
  type: "action",
  abilities: [outOfOrderAbility],
  inkwell: true,
  colors: ["ruby"],
  cost: 7,
  illustrator: "Hedvig H.S",
  number: 148,
  set: "007",
  rarity: "common",
};
