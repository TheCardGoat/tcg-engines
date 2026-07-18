import type { CharacterCard } from "@tcg/op-types";
import { op08CharlotteLinlin069I18n } from "./069-charlotte-linlin.i18n.ts";

export const op08CharlotteLinlin069: CharacterCard = {
  id: "OP08-069",
  canonicalId: "OP08-069",
  slug: "charlotte-linlin/op08-069",
  name: "Charlotte Linlin",
  printings: [
    {
      id: "OP08-069",
      artId: "OP08-069",
      setCode: "OP08",
      collectorNumber: "069",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-069.jpg",
    },
    {
      id: "OP08-069_p1",
      artId: "OP08-069_p1",
      setCode: "OP08",
      collectorNumber: "069",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-069_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "SR",
  setId: "OP08",
  cost: 9,
  power: 9000,
  traits: ["Big Mom Pirates Former Rocks Pirates"],
  attribute: "special",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-069_p1.jpg",
      imageId: "OP08-069_p1",
    },
  ],
  effect:
    "[On Play] DON!! 1, You may trash 1 card from your hand: Add up to 1 card from the top of your deck to the top of your Life cards. Then, add up to 1 of your opponent's Characters with a cost of 6 or less to the top or bottom of your opponent's Life cards face-up.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "addToLife",
            target: {
              player: "self",
              zones: ["deck"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            position: "top",
          },
          {
            action: "addToLife",
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
                  value: 6,
                },
              ],
            },
            position: "choice",
            faceUp: true,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op08CharlotteLinlin069I18n,
};
