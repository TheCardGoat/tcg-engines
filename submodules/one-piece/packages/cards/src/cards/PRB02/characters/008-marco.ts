import type { CharacterCard } from "@tcg/op-types";
import { prb02Marco008I18n } from "./008-marco.i18n.ts";

export const prb02Marco008: CharacterCard = {
  id: "PRB02-008",
  canonicalId: "PRB02-008",
  slug: "marco/prb02-008",
  name: "Marco",
  printings: [
    {
      id: "PRB02-008",
      artId: "PRB02-008",
      setCode: "PRB02",
      collectorNumber: "008",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/PRB02-008.jpg",
    },
    {
      id: "PRB02-008_p1",
      artId: "PRB02-008_p1",
      setCode: "PRB02",
      collectorNumber: "008",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/PRB02-008_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "SR",
  setId: "PRB02",
  cost: 4,
  power: 6000,
  traits: ["Former Whitebeard Pirates Land of Wano"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/PRB02-008_p1.jpg",
      imageId: "PRB02-008_p1",
    },
  ],
  effect:
    "[Blocker](After your opponent declares an attack, you may rest this card to make it the new target of the attack.)[On K.O.] Draw 2 cards.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onKo",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
        ],
      },
    ],
  },
  i18n: prb02Marco008I18n,
};
