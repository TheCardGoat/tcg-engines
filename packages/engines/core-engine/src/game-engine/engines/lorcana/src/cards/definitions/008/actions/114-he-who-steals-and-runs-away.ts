import {
  banishEffect,
  drawCardEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenItemTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import { selfPlayerTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const heWhoStealsAndRunsAway: LorcanaActionCardDefinition = {
  id: "s8j",
  name: "He Who Steals And Runs Away",
  characteristics: ["action"],
  text: "Banish chosen item. Draw a card.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Banish chosen item. Draw a card.",
      targets: [chosenItemTarget],
      effects: [
        banishEffect(),
        drawCardEffect({ targets: [selfPlayerTarget] }),
      ],
    },
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 3,
  illustrator: "Luis Huerta",
  number: 114,
  set: "008",
  rarity: "common",
};
