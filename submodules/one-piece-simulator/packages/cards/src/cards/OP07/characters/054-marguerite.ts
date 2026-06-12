import type { CharacterCard } from "@tcg/op-types";
import { op07Marguerite054I18n } from "./054-marguerite.i18n.ts";

export const op07Marguerite054: CharacterCard = {
  id: "OP07-054",
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP07",
  cost: 3,
  power: 2000,
  traits: ["Amazon Lily"],
  attribute: "wisdom",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On Play] Draw 1 card.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op07Marguerite054I18n,
};
