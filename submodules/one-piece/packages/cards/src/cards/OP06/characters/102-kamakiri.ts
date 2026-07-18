import type { CharacterCard } from "@tcg/op-types";
import { op06Kamakiri102I18n } from "./102-kamakiri.i18n.ts";

export const op06Kamakiri102: CharacterCard = {
  id: "OP06-102",
  canonicalId: "OP06-102",
  slug: "kamakiri",
  name: "Kamakiri",
  printings: [
    {
      id: "OP06-102",
      artId: "OP06-102",
      setCode: "OP06",
      collectorNumber: "102",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-102.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP06",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Sky Island Shandian Warrior"],
  attribute: "slash",
  effect:
    "[Activate:Main][Once Per Turn] You may place 1 Stage with a cost of 1 at the bottom of the owner's deck: K.O. up to 1 of your opponent's Characters with a cost of 2 or less.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "returnCharacterToDeck",
            amount: 1,
            position: "bottom",
            player: "both",
            zones: ["stage"],
            filters: [{ filter: "cost", comparison: "eq", value: 1 }],
          },
        ],
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
                  value: 2,
                },
              ],
            },
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: op06Kamakiri102I18n,
};
