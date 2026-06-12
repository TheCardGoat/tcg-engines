import type { CharacterCard } from "@tcg/op-types";
import { op09Laffitte095I18n } from "./095-laffitte.i18n.ts";

export const op09Laffitte095: CharacterCard = {
  id: "OP09-095",
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "OP09",
  cost: 1,
  power: 1000,
  counter: 1000,
  traits: ["Blackbeard Pirates"],
  attribute: "strike",
  effect:
    '[Activate: Main] You may rest 1 of your DON!! cards and this Character: Look at 5 cards from the top of your deck; reveal up to 1 "Blackbeard Pirates" type card and add it to your hand. Then, place the rest at the bottom of your deck in any order.',
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
                value: "Blackbeard Pirates",
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
  i18n: op09Laffitte095I18n,
};
