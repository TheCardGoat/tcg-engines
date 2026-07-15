import type { CharacterCard } from "@tcg/op-types";
import { op14eb04EdwardNewgate044I18n } from "./044-edward-newgate.i18n.ts";

export const op14eb04EdwardNewgate044: CharacterCard = {
  id: "OP14-044",
  canonicalId: "OP14-044",
  slug: "edward-newgate/op14-044",
  name: "Edward.Newgate",
  printings: [
    {
      id: "OP14-044",
      artId: "OP14-044",
      setCode: "OP14EB04",
      collectorNumber: "044",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-044_aCVyhYk.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP14EB04",
  cost: 8,
  power: 8000,
  counter: 1000,
  traits: ["The Four Emperors Whitebeard Pirates"],
  attribute: "special",
  effect:
    '[Blocker]\n[On Play] Reveal 1 card from the top of your deck. If that card\'s type includes "Whitebeard Pirates", draw 2 cards and trash 1 card from your hand.',
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
            position: "top",
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op14eb04EdwardNewgate044I18n,
};
