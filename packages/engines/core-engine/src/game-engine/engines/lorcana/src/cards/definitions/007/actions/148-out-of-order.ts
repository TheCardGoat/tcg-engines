import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
import { outOfOrderAbility } from "@lorcanito/lorcana-engine/cards/007/abilities";

export const outOfOrder: LorcanitoActionCard = {
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
