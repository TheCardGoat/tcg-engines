import type { ActionCard } from "@tcg/lorcana-types";
import { developYourBrainI18n } from "./161-develop-your-brain.i18n";

export const developYourBrain: ActionCard = {
  id: "GGr",
  canonicalId: "ci_w1L",
  reprints: ["set1-161", "set9-163"],
  cardType: "action",
  name: "Develop Your Brain",
  inkType: ["sapphire"],
  franchise: "Sword in the Stone",
  set: "001",
  cardNumber: 161,
  rarity: "common",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_441f1bb9f8c2478d84c13e70dd62755c",
    tcgPlayer: 650097,
  },
  text: "Look at the top 2 cards of your deck. Put one into your hand and the other on the bottom of the deck.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "scry",
        amount: 2,
        target: "CONTROLLER",
        destinations: [
          {
            zone: "hand",
            min: 1,
            max: 1,
          },
          {
            zone: "deck-bottom",
            remainder: true,
          },
        ],
      },
    },
  ],
  i18n: developYourBrainI18n,
};
