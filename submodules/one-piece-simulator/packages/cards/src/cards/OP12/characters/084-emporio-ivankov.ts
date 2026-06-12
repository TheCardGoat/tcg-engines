import type { CharacterCard } from "@tcg/op-types";
import { op12EmporioIvankov084I18n } from "./084-emporio-ivankov.i18n.ts";

export const op12EmporioIvankov084: CharacterCard = {
  id: "OP12-084",
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP12",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Revolutionary Army"],
  attribute: "special",
  effect:
    '[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)\n[On Play] If your Leader has the "Revolutionary Army" type, trash 3 cards from the top of your deck.',
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Revolutionary Army",
          },
        ],
        actions: [
          {
            action: "trashFromDeck",
            player: "self",
            amount: 3,
          },
        ],
      },
    ],
  },
  i18n: op12EmporioIvankov084I18n,
};
