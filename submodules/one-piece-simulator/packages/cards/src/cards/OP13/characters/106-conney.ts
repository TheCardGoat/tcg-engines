import type { CharacterCard } from "@tcg/op-types";
import { op13Conney106I18n } from "./106-conney.i18n.ts";

export const op13Conney106: CharacterCard = {
  id: "OP13-106",
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP13",
  cost: 1,
  power: 1000,
  counter: 1000,
  trigger: "Play this card.",
  traits: ["Bonney Pirates"],
  attribute: "special",
  effect:
    "[Opponent's Turn] When a [Trigger] activates, this Character gains [Blocker] during this turn.",
  effects: {
    effects: [
      {
        trigger: "whenTriggerActivates",
        conditions: [
          {
            condition: "turn",
            value: "opponent",
          },
        ],
        actions: [
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
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op13Conney106I18n,
};
