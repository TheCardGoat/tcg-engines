import type { CharacterCard } from "@tcg/op-types";
import { op17Caribou101I18n } from "./op17-101-caribou.i18n.ts";

export const op17Caribou101: CharacterCard = {
  id: "OP17-101",
  canonicalId: "OP17-101",
  slug: "caribou/op17-101",
  name: "Caribou",
  printings: [
    {
      id: "OP17-101",
      artId: "OP17-101",
      setCode: "OP17",
      collectorNumber: "101",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-101_JFEnFaR.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP17",
  cost: 5,
  power: 6000,
  counter: 1000,
  trigger:
    "You may trash 1 card from your hand: K.O. up to 1 of your opponent's Characters with a cost of 5 or less.",
  traits: ["Supernovas Caribou Pirates"],
  attribute: "special",
  effect:
    "[Activate: Main] [Once Per Turn] You may add 1 card from the top of your Life cards to your hand: Give up to 1 of your opponent's Characters 3000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "addLifeToHand",
            amount: 1,
            position: "top",
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 3000,
            duration: "thisTurn",
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
      {
        trigger: "trigger",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
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
                  value: 5,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op17Caribou101I18n,
};
