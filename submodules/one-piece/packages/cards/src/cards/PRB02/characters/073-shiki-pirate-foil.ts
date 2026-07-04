import type { CharacterCard } from "@tcg/op-types";
import { prb02ShikiPirateFoil073I18n } from "./073-shiki-pirate-foil.i18n.ts";

export const prb02ShikiPirateFoil073: CharacterCard = {
  id: "OP06-073",
  canonicalId: "OP06-073",
  slug: "shiki-pirate-foil",
  name: "Shiki (Pirate Foil)",
  printings: [
    {
      id: "OP06-073",
      artId: "OP06-073",
      setCode: "PRB02",
      collectorNumber: "073",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-073_p1.jpg",
    },
    {
      id: "OP06-073_r1",
      artId: "OP06-073_r1",
      setCode: "PRB02",
      collectorNumber: "073",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-073_r1.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "PRB02",
  cost: 2,
  power: 1000,
  counter: 1000,
  traits: ["FILM Golden Lion Pirates"],
  attribute: "special",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-073_r1.jpg",
      imageId: "OP06-073_r1",
    },
  ],
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)[On Play] If you have 8 or more DON!! cards on your field, draw 1 card and trash 1 card from your hand.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "donFieldCount",
            player: "self",
            comparison: "gte",
            value: 8,
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
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
  i18n: prb02ShikiPirateFoil073I18n,
};
