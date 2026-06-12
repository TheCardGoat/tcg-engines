import type { CharacterCard } from "@tcg/op-types";
import { op04CharlotteBavarois106I18n } from "./106-charlotte-bavarois.i18n.ts";

export const op04CharlotteBavarois106: CharacterCard = {
  id: "OP04-106",
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP04",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Big Mom Pirates"],
  attribute: "strike",
  effect:
    "[DON!! x1] If you have less Life cards than your opponent, this Character gains +1000 power. [Trigger] You may trash 1 card from your hand: Play this card.",
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
          {
            condition: "lifeComparison",
            selfComparison: "lt",
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
            value: 1000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op04CharlotteBavarois106I18n,
};
