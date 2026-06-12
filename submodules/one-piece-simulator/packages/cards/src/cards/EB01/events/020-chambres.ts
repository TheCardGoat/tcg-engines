import type { EventCard } from "@tcg/op-types";
import { eb01Chambres020I18n } from "./020-chambres.i18n.ts";

export const eb01Chambres020: EventCard = {
  id: "EB01-020",
  cardType: "event",
  color: ["green"],
  rarity: "C",
  setId: "EB01",
  cost: 1,
  traits: ["Heart Pirates Supernovas"],
  effect:
    "[Main] If your Leader has the [Supernovas] type, return 1 of your Characters to the owner's hand, and play up to 1 Character card with a cost of 2 or less from your hand that is a different color than the returned Character.[Trigger] Activate this card's [Main] effect.",
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Supernovas",
          },
        ],
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
            },
          },
        ],
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
  i18n: eb01Chambres020I18n,
};
