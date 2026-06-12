import type { ItemCard } from "@tcg/lorcana-types";
import { theLampI18n } from "./064-the-lamp.i18n";

export const theLamp: ItemCard = {
  id: "gxn",
  canonicalId: "ci_gxn",
  reprints: ["set3-064"],
  cardType: "item",
  name: "The Lamp",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "003",
  cardNumber: 64,
  rarity: "rare",
  cost: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_5008b128a011481396f80e0c9c5424bc",
    tcgPlayer: 539079,
  },
  text: [
    {
      title: "GOOD OR EVIL",
      description:
        "Banish this item — If you have a character named Jafar in play, draw 2 cards. If you have a character named Genie in play, return chosen character with cost 4 or less to their player's hand.",
    },
  ],
  abilities: [
    {
      cost: {
        banishSelf: true,
      },
      effect: {
        type: "sequence",
        steps: [
          {
            condition: {
              type: "has-named-character",
              controller: "you",
              name: "Jafar",
            },
            then: {
              amount: 2,
              target: "CONTROLLER",
              type: "draw",
            },
            type: "conditional",
          },
          {
            condition: {
              type: "has-named-character",
              controller: "you",
              name: "Genie",
            },
            then: {
              target: {
                selector: "chosen",
                count: 1,
                owner: "any",
                zones: ["play"],
                cardTypes: ["character"],
                filter: [
                  {
                    type: "cost-comparison",
                    comparison: "less-or-equal",
                    value: 4,
                  },
                ],
              },
              type: "return-to-hand",
            },
            type: "conditional",
          },
        ],
      },
      id: "1ik-1",
      name: "GOOD OR EVIL",
      text: "GOOD OR EVIL Banish this item — If you have a character named Jafar in play, draw 2 cards. If you have a character named Genie in play, return chosen character with cost 4 or less to their player's hand.",
      type: "activated",
    },
  ],
  i18n: theLampI18n,
};
