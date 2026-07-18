import type { EventCard } from "@tcg/op-types";
import { op04PlagueRounds055I18n } from "./055-plague-rounds.i18n.ts";

export const op04PlagueRounds055: EventCard = {
  id: "OP04-055",
  canonicalId: "OP04-055",
  slug: "plague-rounds",
  name: "Plague Rounds",
  printings: [
    {
      id: "OP04-055",
      artId: "OP04-055",
      setCode: "OP04",
      collectorNumber: "055",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-055.jpg",
    },
  ],
  cardType: "event",
  color: ["blue"],
  rarity: "C",
  setId: "OP04",
  cost: 2,
  traits: ["Animal Kingdom Pirates"],
  effect:
    "[Main] You may trash 1 [Ice Oni] from your hand and place 1 Character with a cost of 4 or less at the bottom of the owner's deck: Play 1 [Ice Oni] from your trash. [Trigger] Activate this card's [Main] effect.",
  effects: {
    effects: [
      {
        trigger: "main",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
            filters: [
              {
                filter: "name",
                value: "Ice Oni",
              },
            ],
          },
          {
            cost: "returnCharacterToDeck",
            amount: 1,
            position: "bottom",
            player: "both",
            filters: [
              {
                filter: "cost",
                comparison: "lte",
                value: 4,
              },
            ],
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "trash",
            },
            count: {
              amount: 1,
            },
            filters: [
              {
                filter: "name",
                value: "Ice Oni",
              },
            ],
          },
        ],
        optional: true,
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "activateEffect",
            effectTrigger: "main",
          },
        ],
      },
    ],
  },
  i18n: op04PlagueRounds055I18n,
};
