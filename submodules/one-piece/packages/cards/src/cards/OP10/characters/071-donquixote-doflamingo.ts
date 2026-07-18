import type { CharacterCard } from "@tcg/op-types";
import { op10DonquixoteDoflamingo071I18n } from "./071-donquixote-doflamingo.i18n.ts";

export const op10DonquixoteDoflamingo071: CharacterCard = {
  id: "OP10-071",
  canonicalId: "OP10-071",
  slug: "donquixote-doflamingo/op10-071",
  name: "Donquixote Doflamingo",
  printings: [
    {
      id: "OP10-071",
      artId: "OP10-071",
      setCode: "OP10",
      collectorNumber: "071",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-071.jpg",
    },
    {
      id: "OP10-071_p1",
      artId: "OP10-071_p1",
      setCode: "OP10",
      collectorNumber: "071",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-071_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "SR",
  setId: "OP10",
  cost: 8,
  power: 9000,
  traits: ["Donquixote Pirates The Seven Warlords of the Sea"],
  attribute: "special",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-071_p1.jpg",
      imageId: "OP10-071_p1",
    },
  ],
  effect:
    '[On Play] DON!! −1: Play up to 1 "Donquixote Pirates" type Character card with a cost of 5 or less from your hand.\n[On Your Opponent\'s Attack] [Once Per Turn] You may rest 1 of your DON!! cards: Add up to 1 DON!! card from your DON!! deck and set it as active.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "cost",
                comparison: "lte",
                value: 5,
              },
              {
                filter: "trait",
                value: "Donquixote Pirates",
                match: "includes",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
        optional: true,
      },
      {
        trigger: "onOpponentAttack",
        costs: [
          {
            cost: "restDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "active",
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: op10DonquixoteDoflamingo071I18n,
};
