import { drawCardEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { selfPlayerTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const findersKeepers: LorcanaActionCardDefinition = {
  id: "ko3",
  missingTestCase: true,
  name: "Finders Keepers",
  characteristics: ["action"],
  text: "Draw 3 cards.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Draw 3 cards.",
      targets: [selfPlayerTarget],
      effects: [drawCardEffect({ value: 3 })],
    },
  ],
  flavour: '"Three wishes, comin\' right up!" \n— Iago',
  inkwell: true,
  colors: ["amethyst"],
  cost: 5,
  illustrator: "Andy Estrada / Stefano Zanchi",
  number: 60,
  set: "SSK",
  rarity: "uncommon",
};
