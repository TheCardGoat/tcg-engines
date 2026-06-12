import type { CharacterCard } from "@tcg/op-types";
import { op02Mr3Galdino065I18n } from "./065-mr-3-galdino.i18n.ts";

export const op02Mr3Galdino065: CharacterCard = {
  id: "OP02-065",
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP02",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Impel Down Former Baroque Works"],
  attribute: "special",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [End of Your Turn] You may trash 1 card from your hand: Set this Character as active.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "endOfYourTurn",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op02Mr3Galdino065I18n,
};
