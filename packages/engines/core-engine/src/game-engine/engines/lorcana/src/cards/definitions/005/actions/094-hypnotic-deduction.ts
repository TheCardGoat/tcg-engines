import {
  drawCardEffect,
  putCardEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { selfPlayerTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const hypnoticDeduction: LorcanaActionCardDefinition = {
  id: "z2p",
  name: "Hypnotic Deduction",
  characteristics: ["action"],
  text: "Draw 3 cards, then put 2 cards from your hand on the top of your deck in any order.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Draw 3 cards, then put 2 cards from your hand on the top of your deck in any order.",
      effects: [
        drawCardEffect({ targets: [selfPlayerTarget], value: 3 }),
        putCardEffect({
          to: "deck",
          from: "hand",
          position: "top",
          targets: [
            {
              type: "card",
              zone: "hand",
              owner: "self",
              count: 2,
            },
          ],
          order: "any",
        }),
      ],
    },
  ],
  flavour:
    "A security device! Easily defeated, of course. Once I make room for the crown, I... can... bring... it... to... him.",
  inkwell: true,
  colors: ["emerald"],
  cost: 2,
  illustrator: "Elodie Mondoloni",
  number: 94,
  set: "SSK",
  rarity: "common",
};
