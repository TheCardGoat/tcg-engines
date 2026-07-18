import type { CharacterCard } from "@tcg/op-types";
import { op06VinsmokeNiji064I18n } from "./064-vinsmoke-niji.i18n.ts";

export const op06VinsmokeNiji064: CharacterCard = {
  id: "OP06-064",
  canonicalId: "OP06-064",
  slug: "vinsmoke-niji/op06-064",
  name: "Vinsmoke Niji",
  printings: [
    {
      id: "OP06-064",
      artId: "OP06-064",
      setCode: "OP06",
      collectorNumber: "064",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-064.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP06",
  cost: 3,
  power: 3000,
  counter: 1000,
  traits: ["The Vinsmoke Family", "GERMA 66"],
  attribute: "special",
  effect:
    "[Activate:Main] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.) You may trash this Character: If your Leader has the [GERMA 66] type, play up to 1 [Vinsmoke Niji] with a cost of 5 from your hand or trash.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
          {
            cost: "trashThisCard",
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: ["hand", "trash"],
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "cost",
                comparison: "eq",
                value: 5,
              },
              {
                filter: "name",
                value: "Vinsmoke Niji",
              },
            ],
            condition: {
              condition: "leaderTrait",
              trait: "GERMA 66",
              match: "includes",
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op06VinsmokeNiji064I18n,
};
