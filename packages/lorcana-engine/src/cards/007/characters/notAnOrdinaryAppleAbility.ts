import type { ActivatedAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
import { anyCard, self } from "@lorcanito/lorcana-engine/abilities/targets";

export const notAnOrdinaryAppleAbility: ActivatedAbility = {
  type: "activated",
  costs: [{ type: "exert" }],
  name: "NOT AN ORDINARY APPLE",
  text: "Choose 3 cards in an opponent's discard and put them under their deck to gain 3 lore. If you moved at least 1 Princess this way, gain 4 lore instead.",
  effects: [
    {
      type: "move",
      to: "deck",
      bottom: true,
      target: {
        type: "card",
        value: 3,
        filters: [
          { filter: "zone", value: "discard" },
          { filter: "owner", value: "opponent" },
        ],
      },
      afterEffect: [
        {
          type: "create-layer-based-on-target",
          target: anyCard, // TODO: Revisit this
          filters: [{ filter: "characteristics", value: ["princess"] }],
          numberOfMatchingTargets: {
            operator: "gte",
            value: 1,
          },
          effects: [
            {
              type: "lore",
              amount: 4,
              modifier: "add",
              target: self,
            },
          ],
          fallback: [
            {
              type: "lore",
              amount: 3, // Changed from 4 to 3 as per the card text
              modifier: "add",
              target: self,
            },
          ],
        },
      ],
    },
  ],
};
