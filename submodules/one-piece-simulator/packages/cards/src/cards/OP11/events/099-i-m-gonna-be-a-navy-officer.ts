import type { EventCard } from "@tcg/op-types";
import { op11IMGonnaBeANavyOfficer099I18n } from "./099-i-m-gonna-be-a-navy-officer.i18n.ts";

export const op11IMGonnaBeANavyOfficer099: EventCard = {
  id: "OP11-099",
  cardType: "event",
  color: ["black"],
  rarity: "R",
  setId: "OP11",
  cost: 1,
  trigger: "Activate this card's [Main] effect.",
  traits: ["Navy East Blue"],
  effect:
    '[Main] Look at 3 cards from the top of your deck; reveal up to 1 "Navy" type card other than [I\'m Gonna Be a Navy Officer!!!] and add it to your hand. Then, trash the rest.',
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
                value: "I'm Gonna Be a Navy Officer!!!",
              },
              {
                filter: "trait",
                value: "Navy",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "trash",
          },
        ],
      },
    ],
  },
  i18n: op11IMGonnaBeANavyOfficer099I18n,
};
