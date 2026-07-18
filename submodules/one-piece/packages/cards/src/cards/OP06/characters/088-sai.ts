import type { CharacterCard } from "@tcg/op-types";
import { op06Sai088I18n } from "./088-sai.i18n.ts";

export const op06Sai088: CharacterCard = {
  id: "OP06-088",
  canonicalId: "OP06-088",
  slug: "sai/op06-088",
  name: "Sai",
  printings: [
    {
      id: "OP06-088",
      artId: "OP06-088",
      setCode: "OP06",
      collectorNumber: "088",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-088.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP06",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Dressrosa Happosui Army"],
  attribute: "slash",
  effect:
    "If your Leader has the {Dressrosa} type and is active, this Character gains +2000 power.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "compound",
            operator: "and",
            conditions: [
              { condition: "leaderTrait", trait: "Dressrosa", match: "includes" },
              {
                condition: "hasCard",
                player: "self",
                zone: "leader",
                filters: [{ filter: "state", value: "active" }],
              },
            ],
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: { player: "self", zones: ["character"], count: { amount: 1 }, self: true },
            value: 2000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op06Sai088I18n,
};
