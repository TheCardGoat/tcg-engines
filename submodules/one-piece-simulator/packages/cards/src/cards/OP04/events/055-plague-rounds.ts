import type { EventCard } from "@tcg/op-types";
import { op04PlagueRounds055I18n } from "./055-plague-rounds.i18n.ts";

export const op04PlagueRounds055: EventCard = {
  id: "OP04-055",
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
