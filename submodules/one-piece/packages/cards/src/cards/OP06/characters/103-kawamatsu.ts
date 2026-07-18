import type { CharacterCard } from "@tcg/op-types";
import { op06Kawamatsu103I18n } from "./103-kawamatsu.i18n.ts";

export const op06Kawamatsu103: CharacterCard = {
  id: "OP06-103",
  canonicalId: "OP06-103",
  slug: "kawamatsu/op06-103",
  name: "Kawamatsu",
  printings: [
    {
      id: "OP06-103",
      artId: "OP06-103",
      setCode: "OP06",
      collectorNumber: "103",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-103.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP06",
  cost: 3,
  power: 5000,
  traits: ["Fish-Man", "Land of Wano", "The Akazaya Nine"],
  attribute: "slash",
  effect:
    "[When Attacking] You may trash 2 cards from your hand: Add up to 1 of your Characters with 0 power to the top or bottom of the owner's Life cards face-up.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        costs: [
          {
            cost: "trashFromHand",
            amount: 2,
          },
        ],
        actions: [
          {
            action: "addToLife",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "power",
                  comparison: "eq",
                  value: 0,
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
  i18n: op06Kawamatsu103I18n,
};
