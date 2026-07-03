import type { CharacterCard } from "@tcg/op-types";
import { prb02KayaReprint044I18n } from "./044-kaya-reprint.i18n.ts";

export const prb02KayaReprint044: CharacterCard = {
  id: "OP03-044",
  canonicalId: "OP03-044",
  slug: "kaya-reprint",
  name: "Kaya (Reprint)",
  printings: [
    {
      id: "OP03-044",
      artId: "OP03-044",
      setCode: "PRB02",
      collectorNumber: "044",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-044_r1.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "PRB02",
  cost: 1,
  power: 0,
  counter: 2000,
  traits: ["East Blue"],
  attribute: "wisdom",
  effect:
    '[On Play] Draw 2 cards and trash 2 cards from your hand.Disclaimer: This card was reprinted from the original set with changes to the copyright information (Note: the original print did not include "EN" at the end of the copyright) and the Artist Credit (Note: there is no pencil design on top of the artist name).',
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
  i18n: prb02KayaReprint044I18n,
};
