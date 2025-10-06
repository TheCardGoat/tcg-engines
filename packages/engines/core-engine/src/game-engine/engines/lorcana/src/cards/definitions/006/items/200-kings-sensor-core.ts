import {
  royalSearch,
  simboulOfRoyalty,
} from "~/game-engine/engines/lorcana/src/cards/definitions/006/items/abilities";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const kingsSensorCore: LorcanaItemCardDefinition = {
  id: "nrj",
  name: "King's Sensor Core",
  characteristics: ["item"],
  text: "**SYMBOL OF ROYALTY** Your Prince and King characters gain Resist +1. (Damage dealt to them is reduced by 1.)\n**ROYAL SEARCH** {E}, 2 {I} – Reveal the top card of your deck. If it's a Prince or King character card, you may put that card into your hand. Otherwise, put it on the top of your deck.",
  type: "item",
  abilities: [simboulOfRoyalty, royalSearch],
  inkwell: true,
  colors: ["steel"],
  cost: 3,
  illustrator: "Juan Diego Leon",
  number: 200,
  set: "006",
  rarity: "rare",
};
