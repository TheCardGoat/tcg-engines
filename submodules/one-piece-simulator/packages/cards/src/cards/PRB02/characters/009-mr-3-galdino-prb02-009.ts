import type { CharacterCard } from "@tcg/op-types";
import { prb02Mr3GaldinoPrb02009009I18n } from "./009-mr-3-galdino-prb02-009.i18n.ts";

export const prb02Mr3GaldinoPrb02009009: CharacterCard = {
  id: "PRB02-009",
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "PRB02",
  cost: 2,
  power: 1000,
  counter: 1000,
  traits: ["Former Baroque Works Cross Guild"],
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
  },
  i18n: prb02Mr3GaldinoPrb02009009I18n,
};
