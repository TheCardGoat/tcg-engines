import type { CharacterCard } from "@tcg/op-types";
import { op08Nami106I18n } from "./106-nami.i18n.ts";

export const op08Nami106: CharacterCard = {
  id: "OP08-106",
  cardType: "character",
  color: ["yellow"],
  rarity: "SR",
  setId: "OP08",
  cost: 5,
  power: 5000,
  counter: 1000,
  traits: ["Straw Hat Crew Egghead"],
  attribute: "special",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-106_p1.jpg",
      imageId: "OP08-106_p1",
    },
  ],
  effect:
    "[On Play] You may trash 1 card with a [Trigger] from your hand: K.O. up to 1 of your opponent's Characters with a cost of 5 or less. Then, if you have 3 or less cards in your hand, draw 1 card. [Trigger] Activate this card's [On Play] effect.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
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
      {
        trigger: "trigger",
        actions: [
          {
            action: "activateEffect",
            effectTrigger: "onPlay",
          },
        ],
      },
    ],
  },
  i18n: op08Nami106I18n,
};
