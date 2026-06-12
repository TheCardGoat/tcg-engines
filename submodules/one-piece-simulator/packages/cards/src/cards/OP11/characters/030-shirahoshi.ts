import type { CharacterCard } from "@tcg/op-types";
import { op11Shirahoshi030I18n } from "./030-shirahoshi.i18n.ts";

export const op11Shirahoshi030: CharacterCard = {
  id: "OP11-030",
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "OP11",
  cost: 1,
  power: 0,
  counter: 1000,
  traits: ["Merfolk Fish-Man Island"],
  attribute: "wisdom",
  effect:
    '[Activate: Main] You may rest 1 of your DON!! cards and this Character: Look at 5 cards from the top of your deck; reveal up to 1 "Neptunian" or "Fish-Man Island" type card and add it to your hand. Then, place the rest at the bottom of your deck in any order.',
  effects: {
    effects: [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "search",
            lookCount: 5,
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
                value: "Neptunian",
              },
              {
                filter: "trait",
                value: "Fish-Man Island",
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
  i18n: op11Shirahoshi030I18n,
};
