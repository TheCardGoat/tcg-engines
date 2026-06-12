import type { CharacterCard } from "@tcg/op-types";
import { op09ProfessorClover102I18n } from "./102-professor-clover.i18n.ts";

export const op09ProfessorClover102: CharacterCard = {
  id: "OP09-102",
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "OP09",
  cost: 1,
  power: 0,
  counter: 2000,
  traits: ["Ohara"],
  attribute: "wisdom",
  effect:
    "[On Play] If your Leader is [Nico Robin], look at 3 cards from the top of your deck; reveal up to 1 card with a [Trigger] and add it to your hand. Then, place the rest at the bottom of your deck in any order.[Trigger] Activate this card's [On Play] effect.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderName",
            name: "Nico Robin",
          },
        ],
        actions: [
          {
            action: "search",
            lookCount: 3,
            source: {
              player: "self",
              zone: "deck",
            },
            revealCount: {
              amount: 1,
              upTo: true,
            },
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "activateEffect",
            effectTrigger: "onPlay",
          },
        ],
      },
    ],
  },
  i18n: op09ProfessorClover102I18n,
};
