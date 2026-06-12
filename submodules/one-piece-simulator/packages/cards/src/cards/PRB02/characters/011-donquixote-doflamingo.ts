import type { CharacterCard } from "@tcg/op-types";
import { prb02DonquixoteDoflamingo011I18n } from "./011-donquixote-doflamingo.i18n.ts";

export const prb02DonquixoteDoflamingo011: CharacterCard = {
  id: "PRB02-011",
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "PRB02",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Donquixote Pirates The Seven Warlords of the Sea"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/PRB02-011_p1.jpg",
      imageId: "PRB02-011_p1",
    },
  ],
  effect:
    "[Blocker][On Play] If your Leader is multicolored, add up to 1 DON!! card from your DON!! deck and rest it.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderMulticolored",
          },
        ],
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "rested",
          },
        ],
      },
    ],
  },
  i18n: prb02DonquixoteDoflamingo011I18n,
};
