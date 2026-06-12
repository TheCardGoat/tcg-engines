import type { CharacterCard } from "@tcg/op-types";
import { eb02DonquixoteRosinante025I18n } from "./025-donquixote-rosinante.i18n.ts";

export const eb02DonquixoteRosinante025: CharacterCard = {
  id: "EB02-025",
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "EB02",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Donquixote Pirates Navy"],
  attribute: "special",
  effect:
    "[Activate: Main] You may rest 1 of your DON!! cards and this Character: If your Leader is [Donquixote Rosinante], look at 5 cards from the top of your deck; play up to 1 Character card with a cost of 2 or less rested. Then, place the rest at the bottom of your deck in any order.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "leaderName",
            name: "Donquixote Rosinante",
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
              amount: 1,
              upTo: true,
            },
            revealDestination: "character",
            remainderPosition: "bottom",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: eb02DonquixoteRosinante025I18n,
};
