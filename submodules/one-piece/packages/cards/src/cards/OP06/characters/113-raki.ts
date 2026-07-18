import type { CharacterCard } from "@tcg/op-types";
import { op06Raki113I18n } from "./113-raki.i18n.ts";

export const op06Raki113: CharacterCard = {
  id: "OP06-113",
  canonicalId: "OP06-113",
  slug: "raki",
  name: "Raki",
  printings: [
    {
      id: "OP06-113",
      artId: "OP06-113",
      setCode: "OP06",
      collectorNumber: "113",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-113.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP06",
  cost: 1,
  power: 1000,
  counter: 1000,
  traits: ["Sky Island Shandian Warrior"],
  attribute: "ranged",
  effect:
    "If you have a [Shandian Warrior] type Character other than [Raki], this Character gains [Blocker].\n(After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "hasCard",
            player: "self",
            zone: "character",
            filters: [
              {
                filter: "trait",
                value: "Shandian Warrior",
                match: "includes",
              },
              {
                filter: "excludeName",
                value: "Raki",
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
  i18n: op06Raki113I18n,
};
