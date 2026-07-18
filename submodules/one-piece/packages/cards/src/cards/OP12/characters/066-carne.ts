import type { CharacterCard } from "@tcg/op-types";
import { op12Carne066I18n } from "./066-carne.i18n.ts";

export const op12Carne066: CharacterCard = {
  id: "OP12-066",
  canonicalId: "OP12-066",
  slug: "carne/op12-066",
  name: "Carne",
  printings: [
    {
      id: "OP12-066",
      artId: "OP12-066",
      setCode: "OP12",
      collectorNumber: "066",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-066_VHa3gq7.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP12",
  cost: 1,
  power: 1000,
  counter: 1000,
  traits: ["East Blue"],
  attribute: "slash",
  effect:
    "If you have 4 or more Events in your trash, this Character gains [Blocker].\n(After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "zoneCount",
            player: "self",
            zone: "trash",
            comparison: "gte",
            value: 4,
            filters: [
              {
                filter: "cardCategory",
                value: "event",
              },
            ],
          },
        ],
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            keyword: "blocker",
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op12Carne066I18n,
};
