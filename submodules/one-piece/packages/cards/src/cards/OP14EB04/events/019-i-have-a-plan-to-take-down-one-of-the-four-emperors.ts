import type { EventCard } from "@tcg/op-types";
import { op14eb04IHaveAPlanToTakeDownOneOfTheFourEmperors019I18n } from "./019-i-have-a-plan-to-take-down-one-of-the-four-emperors.i18n.ts";

export const op14eb04IHaveAPlanToTakeDownOneOfTheFourEmperors019: EventCard = {
  id: "OP14-019",
  canonicalId: "OP14-019",
  slug: "i-have-a-plan-to-take-down-one-of-the-four-emperors",
  name: "I Have a Plan to Take Down One of the Four Emperors!!",
  printings: [
    {
      id: "OP14-019",
      artId: "OP14-019",
      setCode: "OP14EB04",
      collectorNumber: "019",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-019_drkS6oa.jpg",
    },
  ],
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
                filter: "anyOf",
                groups: [
                  [
                    { filter: "cardCategory", value: "character" },
                    { filter: "trait", value: "Supernovas", match: "includes" },
                  ],
                  [
                    { filter: "cardCategory", value: "character" },
                    { filter: "trait", value: "Straw Hat Crew", match: "includes" },
                  ],
                ],
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [{ action: "draw", player: "self", amount: 1 }],
      },
    ],
  },
  i18n: op14eb04IHaveAPlanToTakeDownOneOfTheFourEmperors019I18n,
};
