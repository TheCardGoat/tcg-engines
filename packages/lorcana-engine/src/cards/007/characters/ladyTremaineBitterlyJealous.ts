import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
import { opponentDiscardsARandomCard } from "@lorcanito/lorcana-engine/effects/effects";

export const ladyTremaineBitterlyJealous: LorcanitoCharacterCard = {
  id: "zl6",
  name: "Lady Tremaine",
  title: "Bitterly Jealous",
  characteristics: ["storyborn", "villain"],
  text: "THAT'S QUITE ENOUGH {E} – Return chosen damaged character to their player's hand. Then, each opponent discards a card at random.",
  type: "character",
  abilities: [
    {
      type: "activated",
      costs: [{ type: "exert" }],
      name: "That's Quite Enough",
      text: "Return chosen damaged character to their player's hand. Then, each opponent discards a card at random.",
      resolveEffectsIndividually: true,
      dependentEffects: true,
      effects: [
        {
          type: "move",
          to: "hand",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "zone", value: "play" },
              { filter: "type", value: ["character"] },
              { filter: "status", value: "damaged" },
            ],
          },
        },
        opponentDiscardsARandomCard,
      ],
    },
  ],
  inkwell: false,
  colors: ["emerald"],
  cost: 6,
  strength: 3,
  willpower: 3,
  illustrator: "Goku Kumatori",
  number: 115,
  set: "007",
  rarity: "legendary",
  lore: 2,
};
