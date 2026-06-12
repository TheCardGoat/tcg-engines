import type { EventCard } from "@tcg/op-types";
import { op14eb04Disappointed099I18n } from "./099-disappointed.i18n.ts";

export const op14eb04Disappointed099: EventCard = {
  id: "OP14-099",
  cardType: "event",
  color: ["black"],
  rarity: "UC",
  setId: "OP14EB04",
  cost: 1,
  trigger: "Activate this card's [Main] effect.",
  traits: ["Baroque Works The Seven Warlords of the Sea"],
  effect:
    '[Main] Look at 3 cards from the top of your deck; reveal up to 1 card with a type including "Baroque Works" other than [Disappointed?] and add it to your hand. Then, trash the rest.',
  effects: {
    effects: [
      {
        trigger: "main",
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
                filter: "excludeName",
                value: "Disappointed?",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "trash",
          },
        ],
      },
    ],
  },
  i18n: op14eb04Disappointed099I18n,
};
