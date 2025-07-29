import {
  discardHandEffect,
  drawCardEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { eachPlayerTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const aWholeNewWorld: LorcanaActionCardDefinition = {
  id: "u8m",
  name: "A Whole New World",
  characteristics: ["action", "song"],
  text: "Each player discards their hand and draws 7 cards.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Each player discards their hand and draws 7 cards.",
      effects: [
        discardHandEffect({ targets: [eachPlayerTarget] }),
        drawCardEffect({ targets: [eachPlayerTarget], value: 7 }),
      ],
    },
  ],
  flavour: "Shining, shimmering, splendid . . .",
  colors: ["steel"],
  cost: 5,
  illustrator: "Koni",
  number: 195,
  set: "TFC",
  rarity: "super_rare",
};
