import type { ActionCard } from "@tcg/lorcana-types";
import { seekingTheHalfCrownI18n } from "./064-seeking-the-half-crown.i18n";

export const seekingTheHalfCrown: ActionCard = {
  id: "Kza",
  canonicalId: "ci_xtY",
  reprints: ["set6-064"],
  cardType: "action",
  name: "Seeking the Half Crown",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "006",
  cardNumber: 64,
  rarity: "rare",
  cost: 5,
  inkable: false,
  externalIds: {
    lorcast: "crd_bb8cbf92bd50483b979bd9ad606987ae",
    tcgPlayer: 593042,
  },
  text: [
    {
      title:
        "For each Sorcerer character you have in play, you pay 1 {I} less to play this action.",
    },
    {
      title: "Draw 2 cards.",
    },
  ],
  abilities: [
    {
      type: "static",
      text: "For each Sorcerer character you have in play, you pay 1 {I} less to play this action.",
      sourceZones: ["hand"],
      effect: {
        type: "cost-reduction",
        amount: {
          type: "classification-character-count",
          classification: "Sorcerer",
          controller: "you",
        },
      },
    },
    {
      type: "action",
      text: "Draw 2 cards.",
      effect: {
        type: "draw",
        amount: 2,
        target: "CONTROLLER",
      },
    },
  ],
  i18n: seekingTheHalfCrownI18n,
};
