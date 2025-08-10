import { discardHandEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { eachOpponentTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const submitToMyWill: LorcanaActionCardDefinition = {
  id: "k46",
  missingTestCase: true,
  name: "Bend To My Will",
  characteristics: ["action"],
  text: "Each opponent discards all cards in their hand.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Each opponent discards all cards in their hand.",
      targets: [eachOpponentTarget],
      effects: [discardHandEffect()],
    },
  ],
  inkwell: false,
  colors: ["emerald"],
  cost: 7,
  illustrator: "Michela Cacciatore",
  number: 93,
  set: "006",
  rarity: "super_rare",
};
