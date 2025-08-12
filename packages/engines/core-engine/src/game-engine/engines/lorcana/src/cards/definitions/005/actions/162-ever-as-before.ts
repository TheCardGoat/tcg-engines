import { upToValue } from "~/game-engine/engines/lorcana/src/abilities/ability-types";
import { removeDamageEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { anyNumberOfChosenCharacters } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const everAsBefore: LorcanaActionCardDefinition = {
  id: "nlq",
  missingTestCase: true,
  name: "Ever as Before",
  characteristics: ["action", "song"],
  text: "Remove up to 2 damage from any number of chosen characters.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Remove up to 2 damage from any number of chosen characters.",
      targets: [anyNumberOfChosenCharacters],
      effects: [
        removeDamageEffect({
          targets: [anyNumberOfChosenCharacters],
          value: upToValue(2),
        }),
      ],
    },
  ],
  flavour: "Ever just as sure\nAs the sun will rise",
  inkwell: true,
  colors: ["sapphire"],
  cost: 2,
  illustrator: "Grace Tran",
  number: 162,
  set: "SSK",
  rarity: "common",
};
