import type { CharacterCard } from "@tcg/op-types";
import { op10RoronoaZoro113I18n } from "./113-roronoa-zoro.i18n.ts";

export const op10RoronoaZoro113: CharacterCard = {
  id: "OP10-113",
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP10",
  cost: 3,
  power: 5000,
  trigger:
    'You may trash 1 card from your hand: If your Leader has the "Supernovas" type, play this card.',
  traits: ["Straw Hat Crew Supernovas"],
  attribute: "slash",
  effect: "If you have less Life cards than your opponent, this Character gains [Rush].",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "lifeComparison",
            selfComparison: "lt",
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
            keyword: "rush",
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op10RoronoaZoro113I18n,
};
