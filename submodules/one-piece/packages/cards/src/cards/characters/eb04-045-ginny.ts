import type { CharacterCard } from "@tcg/op-types";
import { eb04Ginny045I18n } from "./eb04-045-ginny.i18n.ts";

export const eb04Ginny045: CharacterCard = {
  id: "EB04-045",
  canonicalId: "EB04-045",
  slug: "ginny/eb04-045",
  name: "Ginny",
  printings: [
    {
      id: "EB04-045",
      artId: "EB04-045",
      setCode: "EB04",
      collectorNumber: "045",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB04-045_9Ru6CYe.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "EB04",
  cost: 1,
  power: 2000,
  counter: 2000,
  traits: ["Revolutionary Army"],
  attribute: "ranged",
  effect:
    "[Activate: Main] You may rest this Character: If there are 2 or more Characters with a cost of 8 or more, up to 1 of your {Revolutionary Army} type Leader or Character cards gains +1000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        oncePerTurn: true,
        costs: [
          {
            cost: "restThisCard",
          },
        ],
        conditions: [
          {
            condition: "zoneCount",
            player: "self",
            zone: "character",
            comparison: "gte",
            value: 2,
            filters: [
              {
                filter: "cost",
                comparison: "gte",
                value: 8,
              },
            ],
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: { amount: 1, upTo: true },
              filters: [
                {
                  filter: "trait",
                  value: "Revolutionary Army",
                  match: "includes",
                },
              ],
            },
            value: 1000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: eb04Ginny045I18n,
};
