import type { CharacterCard } from "@tcg/op-types";
import { op09NicoOlvia106I18n } from "./106-nico-olvia.i18n.ts";

export const op09NicoOlvia106: CharacterCard = {
  id: "OP09-106",
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP09",
  cost: 1,
  power: 0,
  counter: 2000,
  traits: ["Ohara"],
  attribute: "wisdom",
  effect:
    "[On Play] Up to 1 of your [Nico Robin] Leader gains +3000 power during this turn.[Trigger] If your Leader is [Nico Robin], draw 3 cards and trash 2 cards from your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "name",
                  value: "Nico Robin",
                },
              ],
            },
            value: 3000,
            duration: "thisTurn",
          },
        ],
      },
      {
        trigger: "trigger",
        conditions: [
          {
            condition: "leaderName",
            name: "Nico Robin",
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 3,
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 2,
          },
        ],
      },
    ],
  },
  i18n: op09NicoOlvia106I18n,
};
