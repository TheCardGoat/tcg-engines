import type { CharacterCard } from "@tcg/op-types";
import { op03Kaya044I18n } from "./044-kaya.i18n.ts";

export const op03Kaya044: CharacterCard = {
  id: "OP03-044",
  canonicalId: "OP03-044",
  slug: "kaya/op03-044",
  name: "Kaya",
  printings: [
    {
      id: "OP03-044",
      artId: "OP03-044",
      setCode: "OP03",
      collectorNumber: "044",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-044.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP03",
  cost: 1,
  power: 0,
  counter: 2000,
  traits: ["East Blue"],
  attribute: "wisdom",
  effect: "[On Play] Draw 2 cards and trash 2 cards from your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
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
  i18n: op03Kaya044I18n,
};
