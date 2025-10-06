import { drawXCards } from "@lorcanito/lorcana-engine/effects/effects";
import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const kingCandySweetAbomination: LorcanaCharacterCardDefinition = {
  id: "puc",
  name: "King Candy",
  title: "Sweet Abomination",
  characteristics: ["floodborn", "villain", "king"],
  text: "**Shift** 3 _(You may pay 3 {I} to play this on top of one of your characters named King Candy.)_\n \n**CHANGING THE CODE** When you play this character, you may draw 2 cards, then put a card from your hand on the bottom of your deck.",
  type: "character",
  abilities: [
    shiftAbility(3, "King Candy"),
    {
      type: "resolution",
      name: "Changing The Code",
      text: "When you play this character, you may draw 2 cards, then put a card from your hand on the bottom of your deck.",
      optional: true,
      resolveEffectsIndividually: true,
      effects: [
        drawXCards(2),
        {
          type: "move",
          to: "deck",
          bottom: true,
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "zone", value: "hand" },
              { filter: "owner", value: "self" },
            ],
          },
        },
      ],
    },
  ],
  colors: ["sapphire"],
  cost: 5,
  strength: 3,
  willpower: 3,
  lore: 2,
  illustrator: "Jake Parker",
  number: 154,
  set: "SSK",
  rarity: "uncommon",
};
