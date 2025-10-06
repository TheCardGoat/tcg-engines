import {
  destroy,
  happyFace,
} from "~/game-engine/engines/lorcana/src/cards/definitions/006/items/abilities";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const megabot: LorcanaItemCardDefinition = {
  id: "zgw",
  missingTestCase: true,
  name: "Megabot",
  characteristics: ["item"],
  text: "HAPPY FACE This item enters play exerted.\nDESTROY! {E}, Banish this item - Choose one:\n* Banish chosen item.\n* Banish chosen damaged character.",
  type: "item",
  abilities: [happyFace, destroy],
  inkwell: false,
  colors: ["emerald"],
  cost: 2,
  illustrator: "Kamil Murzyn",
  number: 98,
  set: "006",
  rarity: "uncommon",
};
