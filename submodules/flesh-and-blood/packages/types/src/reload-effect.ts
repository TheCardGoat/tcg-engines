import type { FabEffect } from "./abilities/index.ts";

/**
 * CR 8.5.23 Reload: optional discrete effect. Offer it only when arsenal is
 * empty and the hand still has a card. Accepting moves the chosen hand card
 * into arsenal face-down.
 */
export function reloadEffect(): FabEffect {
  return {
    type: "conditional",
    condition: {
      type: "and",
      conditions: [
        {
          type: "zone-count",
          zone: "arsenal",
          player: "controller",
          comparison: { op: "eq", value: 0 },
        },
        {
          type: "zone-count",
          zone: "hand",
          player: "controller",
          comparison: { op: "gte", value: 1 },
        },
      ],
    },
    then: {
      type: "optional",
      effect: {
        type: "move-card",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["hand"],
          count: 1,
        },
        to: { zone: "arsenal" },
        faceDown: true,
      },
    },
  };
}
