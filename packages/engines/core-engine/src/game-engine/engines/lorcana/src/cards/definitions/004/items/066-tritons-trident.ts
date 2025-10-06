import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
import { forEachCardInYourHand } from "@lorcanito/lorcana-engine/abilities/amounts";
import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";

export const tritonsTrident: LorcanaItemCardDefinition = {
  id: "tom",
  missingTestCase: true,
  name: "Triton's Trident",
  characteristics: ["item"],
  text: "**SYMBOL OF POWER** Banish this item — Chosen character gets +1 {S} this turn for each card in your hand.",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "Symbol Of Power",
      text: "Banish this item — Chosen character gets +1 {S} this turn for each card in your hand.",
      costs: [{ type: "banish" }],
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          modifier: "add",
          duration: "turn",
          target: chosenCharacter,
          amount: forEachCardInYourHand,
        },
      ],
    },
  ],
  flavour: '"Just imagine all this power in the wrong hands..." — Ursula',
  inkwell: true,
  colors: ["amethyst"],
  cost: 2,
  illustrator: "Matt Chapman",
  number: 66,
  set: "URR",
  rarity: "uncommon",
};
