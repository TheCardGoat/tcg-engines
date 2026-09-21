import type { EventCard } from "@tcg/op-types";
import { eb04BlackRopeDragonTwiste059I18n } from "./eb04-059-black-rope-dragon-twiste.i18n.ts";

export const eb04BlackRopeDragonTwiste059: EventCard = {
  id: "EB04-059",
  canonicalId: "EB04-059",
  slug: "black-rope-dragon-twiste/eb04-059",
  name: "Black Rope Dragon Twiste",
  printings: [
    {
      id: "EB04-059",
      artId: "EB04-059",
      setCode: "EB04",
      collectorNumber: "059",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB04-059.jpg",
    },
  ],
  cardType: "event",
  color: ["yellow"],
  rarity: "R",
  setId: "EB04",
  cost: 6,
  traits: ["Straw Hat Crew Supernovas Fish-Man Island"],
  effect:
    "[Main] You may turn 1 card from the top of your Life cards face-up: If you have less Characters than your opponent, K.O. up to 1 of your opponent's Characters with a cost of 6 or less and up to 1 of your opponent's Characters with a cost of 5 or less. [Trigger] Draw 2 cards and trash 1 card from your hand.",
  effects: {
    effects: [
      {
        trigger: "main",
        optional: true,
        costs: [
          {
            cost: "turnLifeFaceUp",
            count: 1,
            faceUp: true,
          },
        ],
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: { amount: 1, upTo: true },
              filters: [{ filter: "cost", comparison: "lte", value: 6 }],
            },
            condition: {
              condition: "zoneCountComparison",
              zone: "character",
              selfComparison: "lt",
              difference: 1,
            },
          },
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: { amount: 1, upTo: true },
              filters: [{ filter: "cost", comparison: "lte", value: 5 }],
            },
            condition: {
              condition: "zoneCountComparison",
              zone: "character",
              selfComparison: "lt",
              difference: 1,
            },
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: eb04BlackRopeDragonTwiste059I18n,
};
