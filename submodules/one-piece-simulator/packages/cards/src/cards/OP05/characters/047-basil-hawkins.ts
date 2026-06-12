import type { CharacterCard } from "@tcg/op-types";
import { op05BasilHawkins047I18n } from "./047-basil-hawkins.i18n.ts";

export const op05BasilHawkins047: CharacterCard = {
  id: "OP05-047",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP05",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Animal Kingdom Pirates Hawkins Pirates"],
  attribute: "slash",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On Block] Draw 1 card if you have 3 or less cards in your hand. Then, this Character gains +1000 power during this battle.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onBlock",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
            condition: {
              condition: "handCount",
              player: "self",
              comparison: "lte",
              value: 3,
            },
          },
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
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: op05BasilHawkins047I18n,
};
