import type { CharacterCard } from "@tcg/op-types";
import { op10Smiley009I18n } from "./009-smiley.i18n.ts";

export const op10Smiley009: CharacterCard = {
  id: "OP10-009",
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "OP10",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Biological Weapon Punk Hazard"],
  attribute: "special",
  effect:
    '[On Play] If your Leader has the "Punk Hazard" type, give up to 1 of your opponent\'s Characters 3000 power during this turn.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Punk Hazard",
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
      },
    ],
  },
  i18n: op10Smiley009I18n,
};
