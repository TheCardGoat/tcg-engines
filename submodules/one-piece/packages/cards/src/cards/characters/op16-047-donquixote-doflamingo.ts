import type { CharacterCard } from "@tcg/op-types";
import { op16DonquixoteDoflamingo047I18n } from "./op16-047-donquixote-doflamingo.i18n.ts";

export const op16DonquixoteDoflamingo047: CharacterCard = {
  id: "OP16-047",
  canonicalId: "OP16-047",
  slug: "donquixote-doflamingo/op16-047",
  name: "Donquixote Doflamingo",
  printings: [
    {
      id: "OP16-047",
      artId: "OP16-047",
      setCode: "OP16",
      collectorNumber: "047",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-047_DRprBdq.jpg",
      label: "Donquixote Doflamingo (047)",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP16",
  cost: 3,
  power: 0,
  counter: 1000,
  traits: ["Donquixote Pirates Impel Down"],
  attribute: "special",
  effect:
    "[Activate:Main] You may rest this Character: If your opponent has 8 or more cards in their hand, they place 2 cards from their hand at the bottom of their deck in any order.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        optional: true,
        costs: [
          {
            cost: "restThisCard",
          },
        ],
        conditions: [
          {
            condition: "zoneCount",
            player: "opponent",
            zone: "hand",
            comparison: "gte",
            value: 8,
          },
        ],
        actions: [
          {
            action: "returnToDeck",
            target: {
              player: "opponent",
              zones: ["hand"],
              count: {
                amount: 2,
              },
              chosenBy: "opponent",
            },
            position: "bottom",
            order: "any",
          },
        ],
      },
    ],
  },
  i18n: op16DonquixoteDoflamingo047I18n,
};
