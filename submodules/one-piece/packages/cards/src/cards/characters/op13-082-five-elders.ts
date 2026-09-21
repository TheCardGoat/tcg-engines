import type { CharacterCard } from "@tcg/op-types";
import { op13FiveElders082I18n } from "./op13-082-five-elders.i18n.ts";

export const op13FiveElders082: CharacterCard = {
  id: "OP13-082",
  canonicalId: "OP13-082",
  slug: "five-elders/op13-082",
  name: "Five Elders",
  printings: [
    {
      id: "OP13-082",
      artId: "OP13-082",
      setCode: "OP13",
      collectorNumber: "082",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-082.jpg",
    },
    {
      id: "OP13-082_p1",
      artId: "OP13-082_p1",
      setCode: "OP13",
      collectorNumber: "082",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-082_p1.jpg",
      label: "Five Elders (Alternate Art)",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "SR",
  setId: "OP13",
  cost: 10,
  power: 12000,
  traits: ["Celestial Dragons Five Elders"],
  attribute: ["slash", "special"],
  effect:
    '[Activate: Main] If your Leader is [Imu], you may rest 1 of your DON!! cards and trash 1 card from your hand: Trash all of your Characters and play up to 5 "Five Elders" type Character cards with 5000 power and different card names from your trash.',
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restDon",
            amount: 1,
          },
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "conditional",
            predicate: {
              condition: "leaderName",
              name: "Imu",
            },
            whenTrue: [
              {
                action: "trashFromField",
                target: {
                  player: "self",
                  zones: ["character"],
                  count: {
                    amount: "all",
                  },
                },
              },
              {
                action: "play",
                source: {
                  player: "self",
                  zone: "trash",
                },
                count: {
                  amount: 5,
                  upTo: true,
                },
                differentNames: true,
                filters: [
                  {
                    filter: "power",
                    comparison: "eq",
                    value: 5000,
                  },
                  {
                    filter: "trait",
                    value: "Five Elders",
                    match: "includes",
                  },
                  {
                    filter: "cardCategory",
                    value: "character",
                  },
                ],
              },
            ],
          },
        ],
        optional: true,
        conditions: [
          {
            condition: "leaderName",
            name: "Imu",
          },
        ],
      },
    ],
  },
  i18n: op13FiveElders082I18n,
};
