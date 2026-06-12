import type { CharacterCard } from "@tcg/op-types";
import { op13EdwardNewgate042I18n } from "./042-edward-newgate.i18n.ts";

export const op13EdwardNewgate042: CharacterCard = {
  id: "OP13-042",
  cardType: "character",
  color: ["blue"],
  rarity: "SR",
  setId: "OP13",
  cost: 10,
  power: 12000,
  traits: ["The Four Emperors Whitebeard Pirates"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-042_p1_WwBji85.jpg",
      imageId: "OP13-042_p1",
    },
  ],
  effect:
    "[Blocker]\n[On Play] Draw 2 cards and trash 1 card from your hand. Then, give your Leader and 1 Character up to 2 rested DON!! cards each.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
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
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
              },
            },
            count: {
              amount: 2,
              upTo: true,
            },
            donState: "rested",
          },
        ],
      },
    ],
  },
  i18n: op13EdwardNewgate042I18n,
};
