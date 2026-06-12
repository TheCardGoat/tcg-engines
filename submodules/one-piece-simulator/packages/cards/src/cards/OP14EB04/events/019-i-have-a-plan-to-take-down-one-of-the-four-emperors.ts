import type { EventCard } from "@tcg/op-types";
import { op14eb04IHaveAPlanToTakeDownOneOfTheFourEmperors019I18n } from "./019-i-have-a-plan-to-take-down-one-of-the-four-emperors.i18n.ts";

export const op14eb04IHaveAPlanToTakeDownOneOfTheFourEmperors019: EventCard = {
  id: "OP14-019",
  cardType: "event",
  color: ["red"],
  rarity: "UC",
  setId: "OP14EB04",
  cost: 4,
  trigger: "Draw 1 card.",
  traits: ["Heart Pirates Supernovas The Seven Warlords of the Sea"],
  effect:
    "[Main] Look at 4 cards from the top of your deck; reveal up to 1 {Supernovas} or {Straw Hat Crew} type Character card and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
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
                value: "Supernovas",
              },
              {
                filter: "trait",
                value: "Straw Hat Crew",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op14eb04IHaveAPlanToTakeDownOneOfTheFourEmperors019I18n,
};
