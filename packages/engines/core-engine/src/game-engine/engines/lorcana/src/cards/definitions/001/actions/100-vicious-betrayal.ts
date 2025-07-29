import type { TargetConditionalEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const viciousBetrayal: LorcanaActionCardDefinition = {
  id: "e6i",
  name: "Vicious Betrayal",
  characteristics: ["action"],
  text: "Chosen character gets +2 {S} this turn. If a Villain character is chosen, they get +3 {S} instead.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      effects: [
        {
          type: "target-conditional",
          autoResolve: false,
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
              { filter: "characteristics", value: ["villain"] },
            ],
          },
          effects: [
            {
              type: "attribute",
              attribute: "strength",
              amount: 3,
              modifier: "add",
              duration: "turn",
              target: {
                type: "card",
                value: 1,
                filters: [
                  { filter: "type", value: "character" },
                  { filter: "zone", value: "play" },
                  { filter: "characteristics", value: ["villain"] },
                ],
              },
            },
          ],
          fallback: [
            {
              type: "attribute",
              attribute: "strength",
              amount: 2,
              modifier: "add",
              duration: "turn",
              target: {
                type: "card",
                value: 1,
                filters: [
                  { filter: "type", value: "character" },
                  { filter: "zone", value: "play" },
                ],
              },
            },
          ],
        } as TargetConditionalEffect,
      ],
    },
  ],
  flavour: "A true king takes matters into his own claws. −Scar",
  inkwell: true,
  colors: ["emerald"],
  cost: 1,
  illustrator: "Michaela Martin",
  number: 100,
  set: "TFC",
  rarity: "common",
};
