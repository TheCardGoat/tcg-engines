import type { CharacterCard } from "@tcg/op-types";
import { prb02Mr3GaldinoPrb02009009I18n } from "./009-mr-3-galdino-prb02-009.i18n.ts";

export const prb02Mr3GaldinoPrb02009009: CharacterCard = {
  id: "PRB02-009",
  canonicalId: "PRB02-009",
  slug: "mr-3-galdino-prb02-009",
  name: "Mr.3(Galdino) - PRB02-009",
  printings: [
    {
      id: "PRB02-009",
      artId: "PRB02-009",
      setCode: "PRB02",
      collectorNumber: "009",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/PRB02-009.jpg",
    },
    {
      id: "PRB02-009_p1",
      artId: "PRB02-009_p1",
      setCode: "PRB02",
      collectorNumber: "009",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/PRB02-009_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "PRB02",
  cost: 2,
  power: 1000,
  counter: 1000,
  traits: ["Cross Guild", "Former Baroque Works"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/PRB02-009_p1.jpg",
      imageId: "PRB02-009_p1",
    },
  ],
  effect:
    "This effect can be activated when this Character is rested by your opponent's effect. You may trash this Character and draw 2 cards.[Blocker]",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "whenBecomesRested",
        source: "opponentEffect",
        eventFilter: {
          targetSelf: true,
        },
        costs: [
          {
            cost: "trashThisCard",
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: prb02Mr3GaldinoPrb02009009I18n,
};
