import type { CharacterCard } from "@tcg/op-types";
import { pUsopp049I18n } from "./p-049-usopp.i18n.ts";
export const pUsopp049: CharacterCard = {
  id: "P-049",
  canonicalId: "P-049",
  slug: "usopp/p-049",
  name: "Usopp",
  printings: [
    {
      id: "P-049",
      artId: "P-049",
      setCode: "P",
      collectorNumber: "049",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-049.png",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "P",
  setId: "P",
  cost: 2,
  traits: ["Straw Hat Crew"],
  power: 3000,
  counter: 1000,
  attribute: "ranged",
  effect:
    "[On Play] Look at 5 cards from the top of your deck and place them at the top or bottom of the deck in any order.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "rearrangeDeck",
            player: "self",
            count: 5,
            position: "topOrBottom",
          },
        ],
      },
    ],
  },
  i18n: pUsopp049I18n,
};
