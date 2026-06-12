import type { CharacterCard } from "@tcg/op-types";
import { prb02KillerPirateFoil039I18n } from "./039-killer-pirate-foil.i18n.ts";

export const prb02KillerPirateFoil039: CharacterCard = {
  id: "OP01-039",
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "PRB02",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Kid Pirates Supernovas"],
  attribute: "slash",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-039_r1.jpg",
      imageId: "OP01-039_r1",
    },
  ],
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)[DON!! x1] [On Block] If you have 3 or more Characters, draw 1 card.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onBlock",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
          {
            condition: "zoneCount",
            player: "self",
            zone: "character",
            comparison: "gte",
            value: 3,
          },
        ],
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
  i18n: prb02KillerPirateFoil039I18n,
};
