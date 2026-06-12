import type { CharacterCard } from "@tcg/op-types";
import { op13MarshallDTeach053I18n } from "./053-marshall-d-teach.i18n.ts";

export const op13MarshallDTeach053: CharacterCard = {
  id: "OP13-053",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP13",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Whitebeard Pirates"],
  attribute: "strike",
  effect:
    '[When Attacking] You may trash 1 of your Characters with a type including "Whitebeard Pirates": Draw 1 card and this Character gains [Banish] during this turn.',
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
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op13MarshallDTeach053I18n,
};
