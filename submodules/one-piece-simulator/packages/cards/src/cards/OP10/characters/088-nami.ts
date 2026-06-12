import type { CharacterCard } from "@tcg/op-types";
import { op10Nami088I18n } from "./088-nami.i18n.ts";

export const op10Nami088: CharacterCard = {
  id: "OP10-088",
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP10",
  cost: 2,
  power: 0,
  counter: 1000,
  traits: ["Straw Hat Crew Dressrosa"],
  attribute: "special",
  effect:
    '[Activate: Main] You may rest this Character and 1 of your "Dressrosa" type Leader or Stage cards: Draw 1 card. Then, trash 2 cards from the top of your deck.',
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restThisCard",
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
          {
            action: "trashFromDeck",
            player: "self",
            amount: 2,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op10Nami088I18n,
};
