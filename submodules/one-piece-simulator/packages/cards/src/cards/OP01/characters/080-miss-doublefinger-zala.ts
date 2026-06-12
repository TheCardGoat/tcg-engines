import type { CharacterCard } from "@tcg/op-types";
import { op01MissDoublefingerZala080I18n } from "./080-miss-doublefinger-zala.i18n.ts";

export const op01MissDoublefingerZala080: CharacterCard = {
  id: "OP01-080",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP01",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Baroque Works"],
  attribute: "slash",
  effect: "[On K.O.] Draw a card.",
  effects: {
    effects: [
      {
        trigger: "onKo",
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
  i18n: op01MissDoublefingerZala080I18n,
};
