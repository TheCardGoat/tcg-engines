import type { CharacterCard } from "@tcg/op-types";
import { op08Jack084I18n } from "./084-jack.i18n.ts";

export const op08Jack084: CharacterCard = {
  id: "OP08-084",
  cardType: "character",
  color: ["black"],
  rarity: "SR",
  setId: "OP08",
  cost: 7,
  power: 8000,
  traits: ["Animal Kingdom Pirates"],
  attribute: "slash",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-084_p1.jpg",
      imageId: "OP08-084_p1",
    },
  ],
  effect:
    "This Character gains +4 cost. [Activate: Main] You may rest this Character: Draw 1 card and trash 1 card from your hand. Then, K.O. up to 1 of your opponent's Characters with a cost of 3 or less.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restThisCard",
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
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
                  value: 3,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op08Jack084I18n,
};
