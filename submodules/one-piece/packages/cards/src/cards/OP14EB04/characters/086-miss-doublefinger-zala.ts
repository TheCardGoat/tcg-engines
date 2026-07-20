import type { CharacterCard } from "@tcg/op-types";
import { op14eb04MissDoublefingerZala086I18n } from "./086-miss-doublefinger-zala.i18n.ts";

export const op14eb04MissDoublefingerZala086: CharacterCard = {
  id: "OP14-086",
  canonicalId: "OP14-086",
  slug: "miss-doublefinger-zala/op14-086",
  name: "Miss Doublefinger(Zala)",
  printings: [
    {
      id: "OP14-086",
      artId: "OP14-086",
      setCode: "OP14EB04",
      collectorNumber: "086",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-086_GiTE7DV.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP14EB04",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Baroque Works"],
  attribute: "slash",
  effect:
    'If you have 7 or more cards in your trash, this Character gains +1000 power, and all of your Characters with a type including "Baroque Works" gain +2 cost.',
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "zoneCount",
            player: "self",
            zone: "trash",
            comparison: "gte",
            value: 7,
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 1000,
            duration: "permanent",
          },
          {
            action: "modifyCost",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: "all",
              },
              filters: [
                {
                  filter: "trait",
                  value: "Baroque Works",
                  match: "includes",
                },
              ],
            },
            value: 2,
          },
        ],
      },
    ],
  },
  i18n: op14eb04MissDoublefingerZala086I18n,
};
