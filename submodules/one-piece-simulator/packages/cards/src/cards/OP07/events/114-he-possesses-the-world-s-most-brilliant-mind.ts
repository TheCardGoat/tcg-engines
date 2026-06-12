import type { EventCard } from "@tcg/op-types";
import { op07HePossessesTheWorldSMostBrilliantMind114I18n } from "./114-he-possesses-the-world-s-most-brilliant-mind.i18n.ts";

export const op07HePossessesTheWorldSMostBrilliantMind114: EventCard = {
  id: "OP07-114",
  cardType: "event",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP07",
  cost: 1,
  traits: ["Scientist Egghead"],
  effect:
    "[Main] Look at 5 cards from the top of your deck; reveal up to 1 [Egghead] type card other than [He Possesses the World's Most Brilliant Mind] and add it to your hand. Then, place the rest at the bottom of your deck in any order. [Trigger] Draw 1 card.",
  effects: {
    effects: [
      {
        trigger: "main",
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
                filter: "excludeName",
                value: "He Possesses the World's Most Brilliant Mind",
              },
              {
                filter: "trait",
                value: "Egghead",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op07HePossessesTheWorldSMostBrilliantMind114I18n,
};
