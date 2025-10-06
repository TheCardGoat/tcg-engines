import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
import { kanineKrunchiesAbility } from "~/game-engine/engines/lorcana/src/cards/definitions/007/abilities";

export const kanineKrunchies: LorcanaItemCardDefinition = {
  id: "zay",
  name: "Kanine Krunchies",
  characteristics: ["item"],
  text: "YOU CAN BE A CHAMPION, TOO Your Puppy characters get +1 {W}.",
  type: "item",
  abilities: [kanineKrunchiesAbility],
  inkwell: true,
  colors: ["amber"],
  cost: 1,
  illustrator: "Juan Diego Leon",
  number: 43,
  set: "007",
  rarity: "common",
};
