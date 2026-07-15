import type { CharacterCard } from "@tcg/op-types";
import { op01MissDoublefingerZala080I18n } from "./080-miss-doublefinger-zala.i18n.ts";

export const op01MissDoublefingerZala080: CharacterCard = {
  id: "OP01-080",
  canonicalId: "OP01-080",
  slug: "miss-doublefinger-zala/op01-080",
  name: "Miss Doublefinger(Zala)",
  printings: [
    {
      id: "OP01-080",
      artId: "OP01-080",
      setCode: "OP01",
      collectorNumber: "080",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-080.jpg",
    },
  ],
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
