import type { ItemCard } from "@tcg/lorcana-types";
import { miracleCandleI18n } from "./031-miracle-candle.i18n";

export const miracleCandle: ItemCard = {
  id: "vcN",
  canonicalId: "ci_vcN",
  reprints: ["set4-031"],
  cardType: "item",
  name: "Miracle Candle",
  inkType: ["amber"],
  franchise: "Encanto",
  set: "004",
  cardNumber: 31,
  rarity: "rare",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_f192e99706074455884cf28efb9ee03a",
    tcgPlayer: 549249,
  },
  text: [
    {
      title: "ABUELA'S GIFT",
      description:
        "Banish this item — If you have 3 or more characters in play, gain 2 lore and remove up to 2 damage from chosen location.",
    },
  ],
  abilities: [
    {
      cost: {
        banishSelf: true,
      },
      effect: {
        type: "conditional",
        condition: {
          type: "has-character-count",
          controller: "you",
          comparison: "or-more",
          count: 3,
        },
        then: {
          type: "sequence",
          steps: [
            {
              type: "gain-lore",
              amount: 2,
              target: "CONTROLLER",
            },
            {
              type: "remove-damage",
              amount: { type: "up-to", value: 2 },
              target: {
                selector: "chosen",
                count: 1,
                owner: "any",
                zones: ["play"],
                cardTypes: ["location"],
              },
            },
          ],
        },
      },
      id: "1cb-1",
      name: "ABUELA'S GIFT",
      text: "ABUELA'S GIFT Banish this item — If you have 3 or more characters in play, gain 2 lore and remove up to 2 damage from chosen location.",
      type: "activated",
    },
  ],
  i18n: miracleCandleI18n,
};
