import type { CharacterCard } from "@tcg/op-types";
import { op03Boodle050I18n } from "./050-boodle.i18n.ts";

export const op03Boodle050: CharacterCard = {
  id: "OP03-050",
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP03",
  cost: 2,
  power: 0,
  counter: 1000,
  traits: ["East Blue"],
  attribute: "wisdom",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On K.O.] You may trash 1 card from the top of your deck.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onKo",
        actions: [
          {
            action: "trashFromDeck",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op03Boodle050I18n,
};
