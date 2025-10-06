import { giveThemAShow } from "~/game-engine/engines/lorcana/src/cards/definitions/006/items/abilities";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const transportPod: LorcanaItemCardDefinition = {
  id: "oas",
  name: "Transport Pod",
  characteristics: [],
  text: "GIVE 'EM A SHOW At the start of your turn, you may move a character of yours to a location for free.",
  type: "item",
  abilities: [giveThemAShow],
  inkwell: true,
  colors: ["emerald"],
  cost: 1,
  illustrator: "Eva Widermann",
  number: 100,
  set: "006",
  rarity: "uncommon",
};
