import type { CharacterCard } from "@tcg/op-types";
import { op14eb04SugarOp10065Sp065I18n } from "./065-sugar-op10-065-sp.i18n.ts";

export const op14eb04SugarOp10065Sp065: CharacterCard = {
  id: "OP10-065",
  canonicalId: "OP10-065",
  slug: "sugar-op10-065-sp",
  name: "Sugar - OP10-065 (SP)",
  printings: [
    {
      id: "OP10-065",
      artId: "OP10-065",
      setCode: "OP14EB04",
      collectorNumber: "065",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-065_p1.png",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "OP14EB04",
  cost: 1,
  power: 1000,
  counter: 1000,
  traits: ["Donquixote Pirates"],
  attribute: "special",
  effect:
    "[Activate: Main] Rest 1 of your DON!! cards and you may rest this Character: Look at 5 cards from the top of your deck; reveal up to 1 {Donquixote Pirates} type card and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "rest",
            target: {
              player: "self",
              zones: ["costArea"],
              count: {
                amount: 1,
              },
            },
          },
        ],
      },
    ],
  },
  i18n: op14eb04SugarOp10065Sp065I18n,
};
