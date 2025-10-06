import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
import { spaghettiDinnerAbility } from "~/game-engine/engines/lorcana/src/cards/definitions/007/abilities";

export const spaghettiDinner: LorcanaItemCardDefinition = {
  id: "kpp",
  name: "Spaghetti Dinner",
  characteristics: ["item"],
  text: "FINE DINING {E}, 1 {I} – If you have 2 or more characters in play, gain 1 lore.",
  type: "item",
  abilities: [spaghettiDinnerAbility],
  inkwell: false,
  colors: ["amber"],
  cost: 2,
  illustrator: "Roberto Gatto",
  number: 42,
  set: "007",
  rarity: "common",
};
