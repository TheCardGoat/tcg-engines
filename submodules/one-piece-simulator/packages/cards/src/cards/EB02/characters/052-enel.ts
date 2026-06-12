import type { CharacterCard } from "@tcg/op-types";
import { eb02Enel052I18n } from "./052-enel.i18n.ts";

export const eb02Enel052: CharacterCard = {
  id: "EB02-052",
  cardType: "character",
  color: ["yellow"],
  rarity: "SR",
  setId: "EB02",
  cost: 10,
  power: 11000,
  traits: ["Sky Island"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB02-052_p1.png",
      imageId: "EB02-052_p1",
    },
  ],
  effect:
    'If your Leader has the "Sky Island" type, this Character gains [Rush].\n[When Attacking] You may trash 1 card from your hand: If you have 1 or less Life cards, add up to 1 card from the top of your deck to the top of your Life cards. Then, this Character gains +1000 power during this turn.',
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "lifeCount",
            player: "self",
            comparison: "lte",
            value: 1,
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
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 1000,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: eb02Enel052I18n,
};
