import type { CharacterCard } from "@tcg/op-types";
import { op05FraNosuke070I18n } from "./070-fra-nosuke.i18n.ts";

export const op05FraNosuke070: CharacterCard = {
  id: "OP05-070",
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP05",
  cost: 5,
  power: 4000,
  counter: 2000,
  traits: ["Straw Hat Crew"],
  attribute: "strike",
  effect:
    "[DON!! x1] If you have 8 or more DON!! cards on your field, this Character gains [Rush]. (This card can attack on the turn in which it is played.)",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
          {
            condition: "donFieldCount",
            player: "self",
            comparison: "gte",
            value: 8,
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
  i18n: op05FraNosuke070I18n,
};
