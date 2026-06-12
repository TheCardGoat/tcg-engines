import type { CharacterCard } from "@tcg/op-types";
import { eb03Tashigi018I18n } from "./018-tashigi.i18n.ts";

export const eb03Tashigi018: CharacterCard = {
  id: "EB03-018",
  cardType: "character",
  color: ["green"],
  rarity: "SR",
  setId: "EB03",
  cost: 4,
  power: 6000,
  traits: ["Navy"],
  attribute: "slash",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB03-018_p2_4wKZOzJ.jpg",
      imageId: "EB03-018_p2",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB03-018_p1_lycdaZZ.jpg",
      imageId: "EB03-018_p1",
    },
  ],
  effect:
    "[Opponent's Turn] This Character cannot be K.O.'d by your opponent's effects and gains [Blocker].\n[End of Your Turn] You may rest 1 of your DON!! cards and trash 1 card from your hand: Set this Character as active.",
  effects: {
    effects: [
      {
        trigger: "endOfYourTurn",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
          },
        ],
        optional: true,
      },
    ],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "turn",
            value: "opponent",
          },
        ],
        actions: [
          {
            action: "cannotBeKod",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            duration: "permanent",
            restriction: "byEffect",
          },
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
            keyword: "blocker",
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: eb03Tashigi018I18n,
};
