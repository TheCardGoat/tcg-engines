import type { CharacterCard } from "@tcg/op-types";
import { prb02SanjiP068PirateFoil068I18n } from "./068-sanji-p-068-pirate-foil.i18n.ts";

export const prb02SanjiP068PirateFoil068: CharacterCard = {
  id: "P-068",
  cardType: "character",
  color: ["blue"],
  rarity: "P",
  setId: "PRB02",
  cost: 3,
  power: 4000,
  counter: 2000,
  traits: ["The Vinsmoke Family Kingdom of GERMA"],
  attribute: "strike",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/P-068_r1.jpg",
      imageId: "P-068_r1",
    },
  ],
  effect:
    "[Activate:Main] You may trash this Character: Look at 5 cards from the top of your deck and place them at the top or bottom of the deck in any order.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "trashThisCard",
          },
        ],
        actions: [
          {
            action: "rearrangeDeck",
            player: "self",
            count: 5,
            position: "topOrBottom",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: prb02SanjiP068PirateFoil068I18n,
};
