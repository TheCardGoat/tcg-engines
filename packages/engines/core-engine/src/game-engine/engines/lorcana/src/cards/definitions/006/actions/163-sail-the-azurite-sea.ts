import { drawCardEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { selfPlayerTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const sailTheAzuriteSea: LorcanaActionCardDefinition = {
  id: "dwo",
  name: "Sail The Azurite Sea",
  characteristics: ["action"],
  text: "This turn, you may put an additional card from your hand into your inkwell facedown. Draw a card.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Draw a card.",
      effects: [drawCardEffect({ targets: [selfPlayerTarget] })],
    },
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 2,
  strength: 0,
  illustrator: "Valerio Buonfantino",
  number: 163,
  set: "006",
  rarity: "common",
};
