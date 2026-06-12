import type { CharacterCard } from "@tcg/op-types";
import { op06Taralan089I18n } from "./089-taralan.i18n.ts";

export const op06Taralan089: CharacterCard = {
  id: "OP06-089",
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP06",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Thriller Bark Pirates"],
  attribute: "special",
  effect: "[On Play] / [On K.O.] Trash 3 cards from the top of your deck.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "trashFromDeck",
            player: "self",
            amount: 3,
          },
        ],
      },
      {
        trigger: "onKo",
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
  i18n: op06Taralan089I18n,
};
