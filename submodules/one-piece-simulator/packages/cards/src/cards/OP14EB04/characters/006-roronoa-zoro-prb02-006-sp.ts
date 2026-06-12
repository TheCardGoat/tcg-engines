import type { CharacterCard } from "@tcg/op-types";
import { op14eb04RoronoaZoroPrb02006Sp006I18n } from "./006-roronoa-zoro-prb02-006-sp.i18n.ts";

export const op14eb04RoronoaZoroPrb02006Sp006: CharacterCard = {
  id: "PRB02-006",
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "OP14EB04",
  cost: 4,
  power: 4000,
  counter: 2000,
  traits: ["Straw Hat Crew Supernovas"],
  attribute: "slash",
  effect:
    "[Opponent's Turn] If this Character would be rested by your opponent's Character's effect, you may rest 1 of your other Characters instead.[Blocker]",
  effects: {
    keywords: ["blocker"],
    replacementEffects: [
      {
        replacedEvent: "rested",
        replacementAction: {
          action: "rest",
          target: {
            player: "self",
            zones: ["character"],
            count: {
              amount: 1,
            },
          },
        },
        conditions: [
          {
            condition: "turn",
            value: "opponent",
          },
        ],
      },
    ],
  },
  i18n: op14eb04RoronoaZoroPrb02006Sp006I18n,
};
