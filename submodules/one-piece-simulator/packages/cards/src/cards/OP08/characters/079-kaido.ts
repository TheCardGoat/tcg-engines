import type { CharacterCard } from "@tcg/op-types";
import { op08Kaido079I18n } from "./079-kaido.i18n.ts";

export const op08Kaido079: CharacterCard = {
  id: "OP08-079",
  cardType: "character",
  color: ["black"],
  rarity: "SR",
  setId: "OP08",
  cost: 9,
  power: 9000,
  traits: ["Animal Kingdom Pirates Former Rocks Pirates"],
  attribute: "strike",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-079_p1.jpg",
      imageId: "OP08-079_p1",
    },
  ],
  effect:
    "[Activate:Main] [Once Per Turn] You may trash 1 card from your hand: If this Character was played on this turn, trash up to 1 of your opponent's Characters with a cost of 7 or less. Then, your opponent trashes 1 card from their hand.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "playedThisTurn",
          },
        ],
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "trashFromField",
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
                  value: 7,
                },
              ],
            },
          },
          {
            action: "trashFromHand",
            player: "opponent",
            amount: 1,
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: op08Kaido079I18n,
};
