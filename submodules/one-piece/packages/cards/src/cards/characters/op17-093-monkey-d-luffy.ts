import type { CharacterCard } from "@tcg/op-types";
import { op17MonkeyDLuffy093I18n } from "./op17-093-monkey-d-luffy.i18n.ts";

export const op17MonkeyDLuffy093: CharacterCard = {
  id: "OP17-093",
  canonicalId: "OP17-093",
  slug: "monkey-d-luffy/op17-093",
  name: "Monkey.D.Luffy",
  printings: [
    {
      id: "OP17-093",
      artId: "OP17-093",
      setCode: "OP17",
      collectorNumber: "093",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-093_T4GXCoG.jpg",
      label: "Monkey.D.Luffy (093)",
    },
    {
      id: "OP17-093_p1",
      artId: "OP17-093_p1",
      setCode: "OP17",
      collectorNumber: "093",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-093_p1_A6JR5AM.jpg",
      label: "Monkey.D.Luffy (093) (Alternate Art)",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "SR",
  setId: "OP17",
  cost: 8,
  power: 8000,
  traits: ["Straw Hat Crew The Four Emperors Elbaph"],
  attribute: "strike",
  effect:
    "If there is a Character with a cost of 12 or more, this Character gains [Rush].\n[On Play] Draw 1 card and play up to 1 Character card with a cost of 2 or less from your trash.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
          {
            action: "play",
            source: {
              player: "self",
              zone: "trash",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "cost",
                comparison: "lte",
                value: 2,
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
    permanentEffects: [
      {
        conditions: [
          {
            condition: "existsOnField",
            zone: "character",
            filters: [
              {
                filter: "cost",
                comparison: "gte",
                value: 12,
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
            keyword: "rush",
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op17MonkeyDLuffy093I18n,
};
