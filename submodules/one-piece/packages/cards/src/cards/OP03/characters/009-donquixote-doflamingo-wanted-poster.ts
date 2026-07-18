import type { CharacterCard } from "@tcg/op-types";
import { op03DonquixoteDoflamingoWantedPoster009I18n } from "./009-donquixote-doflamingo-wanted-poster.i18n.ts";

export const op03DonquixoteDoflamingoWantedPoster009: CharacterCard = {
  id: "ST03-009",
  canonicalId: "ST03-009",
  slug: "donquixote-doflamingo-wanted-poster",
  name: "Donquixote Doflamingo (Wanted Poster)",
  printings: [
    {
      id: "ST03-009",
      artId: "ST03-009",
      setCode: "OP03",
      collectorNumber: "009",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST03-009_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "SR",
  setId: "OP03",
  cost: 7,
  power: 7000,
  traits: ["Donquixote Pirates The Seven Warlords of the Sea"],
  attribute: "special",
  effect: "[On Play] Return up to 1 Character with a cost of 7 or less to the owner's hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "any",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 7,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op03DonquixoteDoflamingoWantedPoster009I18n,
};
