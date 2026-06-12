import type { EventCard } from "@tcg/op-types";
import { op09CrossGuild057I18n } from "./057-cross-guild.i18n.ts";

export const op09CrossGuild057: EventCard = {
  id: "OP09-057",
  cardType: "event",
  color: ["blue"],
  rarity: "R",
  setId: "OP09",
  cost: 1,
  trigger: "Activate this card's [Main] effect.",
  traits: ["Cross Guild"],
  effect:
    '[Main] Look at 4 cards from the top of your deck; reveal up to 1 "Cross Guild" type card and add it to your hand. Then, place the rest at the bottom of your deck in any order.',
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "search",
            lookCount: 4,
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
                value: "Cross Guild",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op09CrossGuild057I18n,
};
