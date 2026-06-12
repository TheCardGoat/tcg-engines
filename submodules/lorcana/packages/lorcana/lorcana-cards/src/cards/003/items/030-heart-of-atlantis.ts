import type { ItemCard } from "@tcg/lorcana-types";
import { heartOfAtlantisI18n } from "./030-heart-of-atlantis.i18n";

export const heartOfAtlantis: ItemCard = {
  id: "cVL",
  canonicalId: "ci_cVL",
  reprints: ["set3-030"],
  cardType: "item",
  name: "Heart of Atlantis",
  inkType: ["amber"],
  franchise: "Atlantis",
  set: "003",
  cardNumber: 30,
  rarity: "rare",
  cost: 4,
  inkable: false,
  externalIds: {
    lorcast: "crd_925579c341974d16b613c348efe8df5e",
    tcgPlayer: 536277,
  },
  text: [
    {
      title: "LIFE GIVER",
      description: "{E} — You pay 2 {I} less for the next character you play this turn.",
    },
  ],
  abilities: [
    {
      cost: {
        exert: true,
      },
      effect: {
        amount: 2,
        cardType: "character",
        duration: "next-play-this-turn",
        target: "CONTROLLER",
        type: "cost-reduction",
      },
      id: "zzp-1",
      name: "LIFE GIVER",
      text: "LIFE GIVER {E} — You pay 2 {I} less for the next character you play this turn.",
      type: "activated",
    },
  ],
  i18n: heartOfAtlantisI18n,
};
