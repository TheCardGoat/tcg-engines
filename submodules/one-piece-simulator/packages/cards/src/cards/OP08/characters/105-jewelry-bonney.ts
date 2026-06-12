import type { CharacterCard } from "@tcg/op-types";
import { op08JewelryBonney105I18n } from "./105-jewelry-bonney.i18n.ts";

export const op08JewelryBonney105: CharacterCard = {
  id: "OP08-105",
  cardType: "character",
  color: ["yellow"],
  rarity: "SR",
  setId: "OP08",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Bonney Pirates Egghead"],
  attribute: "special",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-105_p1.jpg",
      imageId: "OP08-105_p1",
    },
  ],
  effect:
    "[DON!! x1] [Your Turn] [Once Per Turn] When a card is removed from your opponent's Life cards, draw 2 cards and trash 1 card from your hand. [Trigger] Draw 2 cards and trash 1 card from your hand.",
  effects: {
    effects: [
      {
        trigger: "trigger",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
          {
            condition: "turn",
            value: "your",
          },
        ],
        actions: [
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op08JewelryBonney105I18n,
};
