import { chosenCharacterCantChallengeDuringNextTurn } from "~/game-engine/engines/lorcana/src/abilities/effect";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const fryingPan: LorcanaItemCardDefinition = {
  characteristics: ["item"],
  id: "r9f",

  name: "Frying Pan",
  text: "**CLANG!** Banish this item - Chosen character can't challenge during their next turn.",
  type: "item",
  abilities: [
    {
      type: "activated",
      optional: false,
      costs: [{ type: "banish" }],
      effects: [chosenCharacterCantChallengeDuringNextTurn],
    },
  ],
  flavour:
    "It's a fine piece of cookware, but as a weapon it's truly stunning.",
  inkwell: true,
  colors: ["steel"],
  cost: 2,
  illustrator: "Kamil Murzyn",
  number: 202,
  set: "TFC",
  rarity: "uncommon",
};
