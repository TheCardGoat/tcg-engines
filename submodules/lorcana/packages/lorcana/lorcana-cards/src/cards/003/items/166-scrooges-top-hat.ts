import type { ItemCard } from "@tcg/lorcana-types";
import { scroogesTopHatI18n } from "./166-scrooges-top-hat.i18n";

export const scroogesTopHat: ItemCard = {
  id: "7iN",
  canonicalId: "ci_7iN",
  reprints: ["set3-166"],
  cardType: "item",
  name: "Scrooge's Top Hat",
  inkType: ["sapphire"],
  franchise: "Ducktales",
  set: "003",
  cardNumber: 166,
  rarity: "uncommon",
  cost: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_9897b7dc2c8142b5b2afc74e87fa14ae",
    tcgPlayer: 537623,
  },
  text: [
    {
      title: "BUSINESS EXPERTISE",
      description: "{E} — You pay 1 {I} less for the next item you play this turn.",
    },
  ],
  abilities: [
    {
      id: "1mq-1",
      text: "BUSINESS EXPERTISE {E} — You pay 1 {I} less for the next item you play this turn.",
      name: "BUSINESS EXPERTISE",
      cost: {
        exert: true,
      },
      effect: {
        type: "cost-reduction",
        amount: 1,
        cardType: "item",
        duration: "next-play-this-turn",
      },
      type: "activated",
    },
  ],
  i18n: scroogesTopHatI18n,
};
