import type { CharacterCard } from "@tcg/op-types";
import { op03Napoleon117I18n } from "./117-napoleon.i18n.ts";

export const op03Napoleon117: CharacterCard = {
  id: "OP03-117",
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP03",
  cost: 3,
  power: 3000,
  counter: 1000,
  traits: ["Big Mom Pirates Homies"],
  attribute: "slash",
  effect:
    "[Activate:Main] You may rest this Character: Up to 1 of your [Charlotte Linlin] cards gains +1000 power until the start of your next turn. [Trigger] Play this card.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restThisCard",
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character", "stage", "costArea"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "name",
                  value: "Charlotte Linlin",
                },
              ],
            },
            value: 1000,
            duration: "untilStartOfNextTurn",
          },
        ],
        optional: true,
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
            },
          },
        ],
      },
    ],
  },
  i18n: op03Napoleon117I18n,
};
