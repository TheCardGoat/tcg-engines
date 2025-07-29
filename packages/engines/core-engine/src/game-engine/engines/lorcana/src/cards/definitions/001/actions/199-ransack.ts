import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
import type { DiscardEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";

export const ransack: LorcanitoActionCard = {
  id: "cfx",
  name: "Ransack",
  characteristics: ["action"],
  text: "Draw 2 cards, then choose and discard 2 cards.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      resolveEffectsIndividually: true,
      effects: [
        {
          type: "draw",
          amount: 2,
          target: {
            type: "player",
            value: "self",
          },
        },
        {
          type: "discard",
          amount: 2,
          target: {
            type: "card",
            value: 2,
            filters: [
              { filter: "owner", value: "self" },
              { filter: "zone", value: "hand" },
            ],
          },
        } as DiscardEffect,
      ],
    },
  ],
  flavour: "Who has time to read labels?",
  inkwell: true,
  colors: ["steel"],
  cost: 2,
  illustrator: "Amber Kommavongsa",
  number: 199,
  set: "TFC",
  rarity: "uncommon",
};
