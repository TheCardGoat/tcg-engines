import type { EventCard } from "@tcg/op-types";
import { eb03WillYouBeMyServant060I18n } from "./060-will-you-be-my-servant.i18n.ts";

export const eb03WillYouBeMyServant060: EventCard = {
  id: "EB03-060",
  cardType: "event",
  color: ["yellow"],
  rarity: "C",
  setId: "EB03",
  cost: 1,
  trigger: "Activate this card's [Main] effect.",
  traits: ["Straw Hat Crew"],
  effect:
    "[Main] If your Leader is [Nami], look at 4 cards from the top of your deck; reveal up to 1 card with a cost of 2 to 8 and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "leaderName",
            name: "Nami",
          },
        ],
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
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: eb03WillYouBeMyServant060I18n,
};
