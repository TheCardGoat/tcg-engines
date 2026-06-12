import type { CharacterCard } from "@tcg/op-types";
import { op10KouzukiMomonosuke028I18n } from "./028-kouzuki-momonosuke.i18n.ts";

export const op10KouzukiMomonosuke028: CharacterCard = {
  id: "OP10-028",
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP10",
  cost: 1,
  power: 1000,
  counter: 1000,
  traits: ["Land of Wano Kouzuki Clan Punk Hazard"],
  attribute: "special",
  effect:
    '[Activate: Main] You may rest 2 of your DON!! cards and trash this Character: Look at 5 cards from the top of your deck; reveal up to 2 "The Akazaya Nine" type cards and add them to your hand. Then, place the rest at the bottom of your deck in any order.',
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
            action: "search",
            lookCount: 5,
            source: {
              player: "self",
              zone: "deck",
            },
            revealCount: {
              amount: 2,
              upTo: true,
            },
            revealFilters: [
              {
                filter: "trait",
                value: "The Akazaya Nine",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op10KouzukiMomonosuke028I18n,
};
