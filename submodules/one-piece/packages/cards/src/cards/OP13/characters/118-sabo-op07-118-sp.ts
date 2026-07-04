import type { CharacterCard } from "@tcg/op-types";
import { op13SaboOp07118Sp118I18n } from "./118-sabo-op07-118-sp.i18n.ts";

export const op13SaboOp07118Sp118: CharacterCard = {
  id: "OP07-118",
  canonicalId: "OP07-118",
  slug: "sabo-op07-118-sp",
  name: "Sabo - OP07-118 (SP)",
  printings: [
    {
      id: "OP07-118",
      artId: "OP07-118",
      setCode: "OP13",
      collectorNumber: "118",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-118_p2_PCjCKMT.png",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "SEC",
  setId: "OP13",
  cost: 8,
  power: 9000,
  traits: ["Revolutionary Army"],
  attribute: "special",
  effect:
    "[On Play] You may trash 1 card from your hand: K.O. up to 1 of your opponent's Characters with a cost of 5 or less and up to 1 of your opponent's Characters with a cost of 3 or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "trashFromHand",
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
                  filter: "cost",
                  comparison: "lte",
                  value: 5,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op13SaboOp07118Sp118I18n,
};
