import type { CharacterCard } from "@tcg/op-types";
import { op03Shirley104I18n } from "./104-shirley.i18n.ts";

export const op03Shirley104: CharacterCard = {
  id: "OP03-104",
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP03",
  cost: 3,
  power: 3000,
  counter: 1000,
  traits: ["Merfolk"],
  attribute: "wisdom",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On Play] Look at up to 1 card from the top of your or your opponent's Life cards, and place it at the top or bottom of the Life cards.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "rearrangeDeck",
            player: "self",
            count: 1,
            position: "topOrBottom",
          },
        ],
      },
    ],
  },
  i18n: op03Shirley104I18n,
};
