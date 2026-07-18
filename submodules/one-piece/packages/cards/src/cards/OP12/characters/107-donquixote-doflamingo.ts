import type { CharacterCard } from "@tcg/op-types";
import { op12DonquixoteDoflamingo107I18n } from "./107-donquixote-doflamingo.i18n.ts";

export const op12DonquixoteDoflamingo107: CharacterCard = {
  id: "OP12-107",
  canonicalId: "OP12-107",
  slug: "donquixote-doflamingo/op12-107",
  name: "Donquixote Doflamingo",
  printings: [
    {
      id: "OP12-107",
      artId: "OP12-107",
      setCode: "OP12",
      collectorNumber: "107",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-107_OigcNUa.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "OP12",
  cost: 8,
  power: 8000,
  traits: ["Donquixote Pirates The Seven Warlords of the Sea"],
  attribute: "special",
  effect:
    "If you have 2 or less Life cards, this Character gains [Rush].\n(This card can attack on the turn in which it is played.)\n[Opponent's Turn] [On K.O.] Add up to 1 card from the top of your deck to the top of your Life cards.",
  effects: {
    effects: [
      {
        trigger: "onKo",
        conditions: [
          {
            condition: "turn",
            value: "opponent",
          },
        ],
        actions: [
          {
            action: "addToLife",
            target: {
              player: "self",
              zones: ["deck"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            position: "top",
          },
        ],
      },
    ],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "lifeCount",
            player: "self",
            comparison: "lte",
            value: 2,
          },
        ],
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            keyword: "rush",
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op12DonquixoteDoflamingo107I18n,
};
