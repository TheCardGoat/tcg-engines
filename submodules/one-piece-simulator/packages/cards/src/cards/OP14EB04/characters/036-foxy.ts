import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Foxy036I18n } from "./036-foxy.i18n.ts";

export const op14eb04Foxy036: CharacterCard = {
  id: "EB04-036",
  cardType: "character",
  color: ["purple"],
  rarity: "SR",
  setId: "OP14EB04",
  cost: 8,
  power: 9000,
  traits: ["Foxy Pirates"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB04-036_p1_GxpOTQr.jpg",
      imageId: "EB04-036_p1",
    },
  ],
  effect:
    "[On Play] DON!! -1: If your Leader has the {Foxy Pirates} type, draw 2 cards and trash 1 card from your hand. Then, rest up to 1 of your opponent's Characters with a cost of 9 or less.\n[Activate: Main] [Once Per Turn] Add up to 1 DON!! card from your DON!! deck and rest it.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Foxy Pirates",
          },
        ],
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
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
            action: "rest",
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
                  value: 9,
                },
              ],
            },
          },
        ],
      },
      {
        trigger: "activateMain",
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "rested",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op14eb04Foxy036I18n,
};
