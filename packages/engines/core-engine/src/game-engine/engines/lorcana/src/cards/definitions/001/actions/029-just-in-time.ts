import { playCardEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { characterCardFromHand } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const justInTime: LorcanaActionCardDefinition = {
  id: "gir",
  name: "Just in Time",
  characteristics: ["action"],
  text: "You may play a character with cost 5 or less for free.",
  type: "action",
  abilities: [
    {
      type: "static",
      optional: true,
      targets: [characterCardFromHand],
      effects: [playCardEffect({ cost: "free" })],
    },
  ],
  flavour:
    "The best heroes always arrive at the perfect moment− \rwhether they know it or not.",
  colors: ["amber"],
  cost: 3,
  illustrator: "Leonardo Giammichele",
  number: 29,
  set: "TFC",
  rarity: "rare",
};
