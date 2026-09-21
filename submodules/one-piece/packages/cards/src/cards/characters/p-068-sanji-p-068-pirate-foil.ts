import type { CharacterCard } from "@tcg/op-types";
import { prb02SanjiP068PirateFoil068I18n } from "./p-068-sanji-p-068-pirate-foil.i18n.ts";

export const prb02SanjiP068PirateFoil068: CharacterCard = {
  id: "P-068",
  canonicalId: "P-068",
  slug: "sanji-p-068-pirate-foil",
  name: "Sanji",
  printings: [
    {
      id: "P-068",
      artId: "P-068",
      setCode: "P",
      collectorNumber: "068",
      rarity: "P",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/P-068_p1.jpg",
      label: "Sanji - P-068 (Pirate Foil)",
    },
    {
      id: "P-068_r1",
      artId: "P-068_r1",
      setCode: "P",
      collectorNumber: "068",
      rarity: "P",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/P-068_r1.jpg",
      label: "Sanji - P-068 (Reprint)",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "P",
  setId: "P",
  cost: 3,
  power: 4000,
  counter: 2000,
  traits: ["The Vinsmoke Family Kingdom of GERMA"],
  attribute: "strike",
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
