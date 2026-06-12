import type { CharacterCard } from "@tcg/op-types";
import { op09GolDRoger118I18n } from "./118-gol-d-roger.i18n.ts";

export const op09GolDRoger118: CharacterCard = {
  id: "OP09-118",
  cardType: "character",
  color: ["red"],
  rarity: "SEC",
  setId: "OP09",
  cost: 10,
  power: 13000,
  traits: ["Roger Pirates King of the Pirates"],
  attribute: "slash",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-118_p2.jpg",
      imageId: "OP09-118_p2",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-118_p1.jpg",
      imageId: "OP09-118_p1",
    },
  ],
  effect:
    "[Rush] (This card can attack on the turn in which it is played.)\nWhen your opponent activates [Blocker], if either you or your opponent has 0 Life cards, you win the game.",
  effects: {
    keywords: ["rush", "blocker"],
  },
  i18n: op09GolDRoger118I18n,
};
