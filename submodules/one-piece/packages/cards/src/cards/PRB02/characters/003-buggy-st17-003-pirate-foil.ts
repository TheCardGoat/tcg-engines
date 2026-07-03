import type { CharacterCard } from "@tcg/op-types";
import { prb02BuggySt17003PirateFoil003I18n } from "./003-buggy-st17-003-pirate-foil.i18n.ts";

export const prb02BuggySt17003PirateFoil003: CharacterCard = {
  id: "ST17-003",
  canonicalId: "ST17-003",
  slug: "buggy-st17-003-pirate-foil",
  name: "Buggy - ST17-003 (Pirate Foil)",
  printings: [
    {
      id: "ST17-003",
      artId: "ST17-003",
      setCode: "PRB02",
      collectorNumber: "003",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST17-003_p3.jpg",
    },
    {
      id: "ST17-003_r1",
      artId: "ST17-003_r1",
      setCode: "PRB02",
      collectorNumber: "003",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST17-003_r1.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "PRB02",
  cost: 1,
  power: 2000,
  counter: 2000,
  traits: ["Buggy's Delivery The Seven Warlords of the Sea"],
  attribute: "slash",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST17-003_r1.jpg",
      imageId: "ST17-003_r1",
    },
  ],
  effect:
    "[On Play] Look at 3 cards from the top of your deck and place them at the top of your deck in any order.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "rearrangeDeck",
            player: "self",
            count: 3,
            position: "top",
          },
        ],
      },
    ],
  },
  i18n: prb02BuggySt17003PirateFoil003I18n,
};
