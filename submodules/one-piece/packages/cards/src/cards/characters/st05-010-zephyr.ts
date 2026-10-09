import type { CharacterCard } from "@tcg/op-types";
import { st05Zephyr010I18n } from "./st05-010-zephyr.i18n.ts";

export const st05Zephyr010: CharacterCard = {
  id: "ST05-010",
  canonicalId: "ST05-010",
  slug: "zephyr/st05-010",
  name: "Zephyr",
  printings: [
    {
      id: "ST05-010",
      artId: "ST05-010",
      setCode: "ST05",
      collectorNumber: "010",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST05-010.png",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "ST05",
  cost: 7,
  power: 8000,
  traits: ["FILM", "Neo Navy"],
  attribute: "strike",
  effect:
    "When this Character battles ＜Strike＞ attribute Characters, this Character gains +3000 power during this turn. [Activate: Main] [Once Per Turn] DON!! −1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): This Character gains +2000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "endOfBattle",
        eventFilter: {
          battlePowerCompared: true,
          anyOf: [
            {
              sourceSelf: true,
              targetFilters: [
                {
                  filter: "cardCategory",
                  value: "character",
                },
                {
                  filter: "attribute",
                  value: "strike",
                },
              ],
            },
            {
              targetSelf: true,
              sourceFilters: [
                {
                  filter: "cardCategory",
                  value: "character",
                },
                {
                  filter: "attribute",
                  value: "strike",
                },
              ],
            },
          ],
        },
        actions: [
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
            value: 3000,
            duration: "thisTurn",
          },
        ],
      },
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
        actions: [
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
            value: 2000,
            duration: "thisTurn",
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: st05Zephyr010I18n,
};
