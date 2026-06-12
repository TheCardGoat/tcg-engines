import type { CharacterCard } from "@tcg/op-types";
import { op04MissMerrychristmasDrophy067I18n } from "./067-miss-merrychristmas-drophy.i18n.ts";

export const op04MissMerrychristmasDrophy067: CharacterCard = {
  id: "OP04-067",
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP04",
  cost: 4,
  power: 4000,
  traits: ["Baroque Works"],
  attribute: "slash",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [Trigger] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Play this card.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "trigger",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
            },
          },
        ],
      },
    ],
  },
  i18n: op04MissMerrychristmasDrophy067I18n,
};
