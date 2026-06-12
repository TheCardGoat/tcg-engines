import type { CharacterCard } from "@tcg/op-types";
import { op10UrougeSp021I18n } from "./021-urouge-sp.i18n.ts";

export const op10UrougeSp021: CharacterCard = {
  id: "OP07-021",
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "OP10",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Fallen Monk Pirates Supernovas"],
  attribute: "strike",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)\n[End of Your Turn] Set up to 1 of your DON!! cards as active.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "endOfYourTurn",
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["costArea"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
          },
        ],
      },
    ],
  },
  i18n: op10UrougeSp021I18n,
};
