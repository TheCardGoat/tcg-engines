import type { CharacterCard } from "@tcg/op-types";
import { op17LuckyRoux033I18n } from "./op17-033-lucky-roux.i18n.ts";

export const op17LuckyRoux033: CharacterCard = {
  id: "OP17-033",
  canonicalId: "OP17-033",
  slug: "lucky-roux/op17-033",
  name: "Lucky.Roux",
  printings: [
    {
      id: "OP17-033",
      artId: "OP17-033",
      setCode: "OP17",
      collectorNumber: "033",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-033_Ztm0iHM.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "OP17",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Red-Haired Pirates"],
  attribute: "ranged",
  effect:
    "[On Play] Look at 3 cards from the top of your deck; reveal up to 1 card with a type including \"Red-Haired Pirates\" and add it to your hand. Then, place the rest at the bottom of your deck in any order.\n[On Your Opponent's Attack] You may trash this Character: Rest up to 1 of your opponent's Leader or Characters.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "search",
            lookCount: 3,
            source: {
              player: "self",
              zone: "deck",
            },
            revealCount: {
              amount: 1,
              upTo: true,
            },
            revealFilters: [
              {
                filter: "trait",
                value: "Red-Haired Pirates",
                match: "includes",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
      {
        trigger: "onOpponentAttack",
        costs: [
          {
            cost: "trashThisCard",
          },
        ],
        actions: [
          {
            action: "rest",
            target: {
              player: "opponent",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op17LuckyRoux033I18n,
};
