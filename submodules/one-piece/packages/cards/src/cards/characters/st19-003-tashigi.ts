import type { CharacterCard } from "@tcg/op-types";
import { st19Tashigi003I18n } from "./st19-003-tashigi.i18n.ts";
export const st19Tashigi003: CharacterCard = {
  id: "ST19-003",
  canonicalId: "ST19-003",
  slug: "tashigi/st19-003",
  name: "Tashigi",
  printings: [
    {
      id: "ST19-003",
      artId: "ST19-003",
      setCode: "ST19",
      collectorNumber: "003",
      rarity: "SR",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST19-003.png",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "SR",
  setId: "ST19",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "slash",
  effect:
    "[On Play] If your Leader is [Smoker], give up to 1 of your opponent's Characters −4 cost during this turn. [Activate: Main] [Once Per Turn] If this Character was played on this turn, trash up to 1 of your opponent's Characters with a cost of 0.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderName",
            name: "Smoker",
          },
        ],
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -4,
            duration: "thisTurn",
          },
        ],
      },
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "playedThisTurn",
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
                  comparison: "eq",
                  value: 0,
                },
              ],
            },
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: st19Tashigi003I18n,
};
