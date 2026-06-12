import type { CharacterCard } from "@tcg/op-types";
import { op03MarshallDTeach012I18n } from "./012-marshall-d-teach.i18n.ts";

export const op03MarshallDTeach012: CharacterCard = {
  id: "OP03-012",
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "OP03",
  cost: 4,
  power: 6000,
  traits: ["Whitebeard Pirates"],
  attribute: "strike",
  effect:
    "[When Attacking] You may trash 1 of your red Characters with 4000 power or more: Draw 1 card. Then, this Character gains +1000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
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
        optional: true,
      },
    ],
  },
  i18n: op03MarshallDTeach012I18n,
};
