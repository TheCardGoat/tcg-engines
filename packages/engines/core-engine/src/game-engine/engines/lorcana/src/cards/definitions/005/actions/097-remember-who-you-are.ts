import { handSizeDifference } from "~/game-engine/engines/lorcana/src/abilities/ability-types";
import { drawCardEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import {
  chosenPlayerTarget,
  selfPlayerTarget,
} from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const rememberWhoYouAre: LorcanaActionCardDefinition = {
  id: "jps",
  missingTestCase: true,
  name: "Remember Who You Are",
  characteristics: ["action"],
  text: "If chosen opponent has more cards in their hand than you, draw cards until you have the same number.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "If chosen opponent has more cards in their hand than you, draw cards until you have the same number.",
      targets: [chosenPlayerTarget],
      effects: [
        drawCardEffect({
          targets: [selfPlayerTarget],
          value: handSizeDifference("self", "target"),
        }),
      ],
    },
  ],
  colors: ["emerald"],
  cost: 4,
  illustrator: "Cory Godbey",
  number: 97,
  set: "SSK",
  rarity: "rare",
};
