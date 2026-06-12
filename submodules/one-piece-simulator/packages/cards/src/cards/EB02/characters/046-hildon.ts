import type { CharacterCard } from "@tcg/op-types";
import { eb02Hildon046I18n } from "./046-hildon.i18n.ts";

export const eb02Hildon046: CharacterCard = {
  id: "EB02-046",
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "EB02",
  cost: 3,
  power: 3000,
  counter: 2000,
  traits: ["Thriller Bark Pirates"],
  attribute: "wisdom",
  effect:
    "[On Play] Trash 2 cards from the top of your deck and give up to 1 of your opponent's Characters 1 cost during this turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "trashFromDeck",
            player: "self",
            amount: 2,
          },
          {
            action: "modifyCost",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 1,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: eb02Hildon046I18n,
};
