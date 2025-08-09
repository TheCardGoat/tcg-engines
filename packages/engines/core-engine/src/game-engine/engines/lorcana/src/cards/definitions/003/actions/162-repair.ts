import { upToValue } from "~/game-engine/engines/lorcana/src/abilities/ability-types";
import { removeDamageEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const repair: LorcanaActionCardDefinition = {
  id: "wr7",
  missingTestCase: true,
  name: "Repair",
  characteristics: ["action"],
  text: "Remove up to 3 damage from one of your locations or characters.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Remove up to 3 damage from one of your locations or characters.",
      targets: [
        {
          type: "card",
          cardType: ["location", "character"],
          owner: "self",
          count: 1,
        },
      ],
      effects: [
        removeDamageEffect({
          value: upToValue(3),
        }),
      ],
    },
  ],
  flavour: "I'm thinkin' about opening a shop here. What do you think?",
  inkwell: true,
  colors: ["sapphire"],
  cost: 2,
  illustrator: "Denny Minonne",
  number: 162,
  set: "ITI",
  rarity: "common",
};
