import type { CharacterCard } from "@tcg/op-types";
import { op14eb04GroggyMonsters033I18n } from "./033-groggy-monsters.i18n.ts";

export const op14eb04GroggyMonsters033: CharacterCard = {
  id: "EB04-033",
  canonicalId: "EB04-033",
  slug: "groggy-monsters",
  name: "Groggy Monsters",
  printings: [
    {
      id: "EB04-033",
      artId: "EB04-033",
      setCode: "OP14EB04",
      collectorNumber: "033",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB04-033_EjnNFTQ.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP14EB04",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Fish-Man Giant Foxy Pirates"],
  attribute: "strike",
  effect:
    "[On Play] DON!! 1: If you have 3 or more {Foxy Pirates} type Characters, K.O. up to 1 of your opponent's Characters with 6000 base power or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "basePower",
                  comparison: "lte",
                  value: 6000,
                },
              ],
            },
            condition: {
              condition: "zoneCount",
              player: "self",
              zone: "character",
              comparison: "gte",
              value: 3,
              filters: [
                {
                  filter: "trait",
                  value: "Foxy Pirates",
                  match: "includes",
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op14eb04GroggyMonsters033I18n,
};
