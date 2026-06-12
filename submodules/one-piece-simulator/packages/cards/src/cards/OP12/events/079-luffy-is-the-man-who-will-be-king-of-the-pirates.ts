import type { EventCard } from "@tcg/op-types";
import { op12LuffyIsTheManWhoWillBeKingOfThePirates079I18n } from "./079-luffy-is-the-man-who-will-be-king-of-the-pirates.i18n.ts";

export const op12LuffyIsTheManWhoWillBeKingOfThePirates079: EventCard = {
  id: "OP12-079",
  cardType: "event",
  color: ["purple"],
  rarity: "R",
  setId: "OP12",
  cost: 1,
  traits: ["Straw Hat Crew"],
  effect:
    "[Main] If your Leader is [Sanji], look at 3 cards from the top of your deck and add up to 1 card to your hand. Then, place the rest at the bottom of your deck in any order.",
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "leaderName",
            name: "Sanji",
          },
        ],
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
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op12LuffyIsTheManWhoWillBeKingOfThePirates079I18n,
};
