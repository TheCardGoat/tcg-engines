import { returnCardEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenCharacterItemOrLocationWithCost2OrLessTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const poorUnfortunateSouls: LorcanaActionCardDefinition = {
  id: "d2i",
  missingTestCase: false,
  name: "Poor Unfortunate Souls",
  characteristics: ["action", "song"],
  text: "Return a character, item or location with cost 2 or less to their player's hand.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Return a character, item or location with cost 2 or less to their player's hand.",
      targets: [chosenCharacterItemOrLocationWithCost2OrLessTarget],
      effects: [
        returnCardEffect({
          to: "hand",
        }),
      ],
    },
  ],
  flavour: "It's sad but true",
  inkwell: true,
  colors: ["amethyst"],
  cost: 2,
  illustrator: "Denny Minonne",
  number: 60,
  set: "URR",
  rarity: "common",
};
