import type { EventCard } from "@tcg/op-types";
import { op05ItSAWasteOfHumanLife058I18n } from "./058-it-s-a-waste-of-human-life.i18n.ts";

export const op05ItSAWasteOfHumanLife058: EventCard = {
  id: "OP05-058",
  cardType: "event",
  color: ["blue"],
  rarity: "C",
  setId: "OP05",
  cost: 8,
  traits: ["Navy"],
  effect:
    "[Main] Place all Characters with a cost of 3 or less at the bottom of the owner's deck. Then, you and your opponent trash cards from your hands until you each have 5 cards in your hands. [Trigger] Place all Characters with a cost of 2 or less at the bottom of the owner's deck.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "returnToDeck",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: "all",
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 3,
                },
              ],
            },
            position: "bottom",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "returnToDeck",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: "all",
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 2,
                },
              ],
            },
            position: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op05ItSAWasteOfHumanLife058I18n,
};
