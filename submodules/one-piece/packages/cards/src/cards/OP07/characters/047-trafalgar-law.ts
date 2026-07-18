import type { CharacterCard } from "@tcg/op-types";
import { op07TrafalgarLaw047I18n } from "./047-trafalgar-law.i18n.ts";

export const op07TrafalgarLaw047: CharacterCard = {
  id: "OP07-047",
  canonicalId: "OP07-047",
  slug: "trafalgar-law/op07-047",
  name: "Trafalgar Law",
  printings: [
    {
      id: "OP07-047",
      artId: "OP07-047",
      setCode: "OP07",
      collectorNumber: "047",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-047.jpg",
    },
    {
      id: "OP07-047_p1",
      artId: "OP07-047_p1",
      setCode: "OP07",
      collectorNumber: "047",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-047_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP07",
  cost: 4,
  power: 4000,
  counter: 2000,
  traits: ["Heart Pirates The Seven Warlords of the Sea"],
  attribute: "slash",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-047_p1.jpg",
      imageId: "OP07-047_p1",
    },
  ],
  effect:
    "[Activate: Main] You may return this Character to the owner's hand: If your opponent has 6 or more cards in their hand, your opponent places 1 card from their hand at the bottom of their deck.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "returnThisToHand",
          },
        ],
        actions: [
          {
            action: "returnToDeck",
            target: {
              player: "opponent",
              zones: ["hand"],
              count: {
                amount: 1,
              },
              chosenBy: "opponent",
            },
            position: "bottom",
            condition: {
              condition: "handCount",
              player: "opponent",
              comparison: "gte",
              value: 6,
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op07TrafalgarLaw047I18n,
};
