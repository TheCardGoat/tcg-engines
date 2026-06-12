import type { ActionCard } from "@tcg/lorcana-types";
import { freezeTheVineI18n } from "./096-freeze-the-vine.i18n";

export const freezeTheVine: ActionCard = {
  id: "DI6",
  canonicalId: "ci_LB6",
  reprints: ["set11-096"],
  cardType: "action",
  name: "Freeze the Vine",
  inkType: ["emerald"],
  franchise: "Frozen",
  set: "011",
  cardNumber: 96,
  rarity: "rare",
  cost: 4,
  inkable: true,
  externalIds: {
    lorcast: "crd_d0659baf8fad4748ae9abf7260279d8c",
    tcgPlayer: 675395,
  },
  text: "Banish all locations. Draw 2 cards, then choose and discard a card.",
  abilities: [
    {
      type: "action",
      text: "Banish all locations. Draw 2 cards, then choose and discard a card.",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "banish",
            target: {
              selector: "all",
              count: "all",
              owner: "any",
              zones: ["play"],
              cardTypes: ["location"],
            },
          },
          {
            type: "draw",
            amount: 2,
            target: "CONTROLLER",
          },
          {
            type: "discard",
            amount: 1,
            chosen: true,
            from: "hand",
            target: "CONTROLLER",
          },
        ],
      },
    },
  ],
  i18n: freezeTheVineI18n,
};
