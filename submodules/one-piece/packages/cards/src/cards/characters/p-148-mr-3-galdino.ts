import type { CharacterCard } from "@tcg/op-types";
import { pMr3Galdino148I18n } from "./p-148-mr-3-galdino.i18n.ts";
export const pMr3Galdino148: CharacterCard = {
  id: "P-148",
  canonicalId: "P-148",
  slug: "mr-3-galdino/p-148",
  name: "Mr.3(Galdino)",
  printings: [
    {
      id: "P-148",
      artId: "P-148",
      setCode: "P",
      collectorNumber: "148",
      rarity: "P",
      imageUrl: "https://asia-en.onepiece-cardgame.com/images/cardlist/card/P-148.png",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "P",
  setId: "P",
  cost: 5,
  traits: ["Baroque Works"],
  power: 6000,
  attribute: "special",
  counter: 1000,
  effect:
    "[Blocker] [Activate: Main] [Once Per Turn] If there is a Character with a cost of 0 or with a cost of 8 or more, give up to 1 rested DON!! card to your Leader or 1 of your Characters.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "zoneCount",
            comparison: "gte",
            value: 1,
            player: "any",
            zone: "character",
            filters: [
              {
                filter: "anyOf",
                filters: [
                  {
                    filter: "cost",
                    value: 0,
                    comparison: "eq",
                  },
                  {
                    filter: "cost",
                    value: 8,
                    comparison: "gte",
                  },
                ],
              },
            ],
          },
        ],
        oncePerTurn: true,
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            count: {
              amount: 1,
              upTo: true,
            },
            donState: "rested",
          },
        ],
      },
    ],
  },
  i18n: pMr3Galdino148I18n,
};
