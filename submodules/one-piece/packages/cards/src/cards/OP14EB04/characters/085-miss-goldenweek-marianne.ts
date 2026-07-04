import type { CharacterCard } from "@tcg/op-types";
import { op14eb04MissGoldenweekMarianne085I18n } from "./085-miss-goldenweek-marianne.i18n.ts";

export const op14eb04MissGoldenweekMarianne085: CharacterCard = {
  id: "OP14-085",
  canonicalId: "OP14-085",
  slug: "miss-goldenweek-marianne/op14-085",
  name: "Miss.Goldenweek(Marianne)",
  printings: [
    {
      id: "OP14-085",
      artId: "OP14-085",
      setCode: "OP14EB04",
      collectorNumber: "085",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-085_kBVpF2Y.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP14EB04",
  cost: 1,
  power: 2000,
  counter: 2000,
  traits: ["Baroque Works"],
  attribute: "wisdom",
  effect: "[On K.O.] Draw 2 cards and trash 2 cards from your hand.",
  effects: {
    effects: [
      {
        trigger: "onKo",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 2,
          },
        ],
      },
    ],
  },
  i18n: op14eb04MissGoldenweekMarianne085I18n,
};
