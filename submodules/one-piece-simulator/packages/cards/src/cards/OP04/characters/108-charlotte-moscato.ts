import type { CharacterCard } from "@tcg/op-types";
import { op04CharlotteMoscato108I18n } from "./108-charlotte-moscato.i18n.ts";

export const op04CharlotteMoscato108: CharacterCard = {
  id: "OP04-108",
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP04",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Big Mom Pirates"],
  attribute: "slash",
  effect:
    "[DON!! x1] This Character gains [Banish]. (When this card deals damage, the target card is trashed without activating its Trigger.) [Trigger] You may trash 1 card from your hand: Play this card.",
  effects: {
    effects: [
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
        optional: true,
      },
    ],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
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
            keyword: "banish",
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op04CharlotteMoscato108I18n,
};
