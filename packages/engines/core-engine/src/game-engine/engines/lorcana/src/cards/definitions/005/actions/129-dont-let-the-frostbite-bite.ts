import { FOR_THE_REST_OF_THIS_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import { yourCharactersTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const dontLetTheFrostbiteBite: LorcanaActionCardDefinition = {
  id: "rdl",
  missingTestCase: true,
  name: "Don't Let the Frostbite Bite",
  characteristics: ["action", "song"],
  text: "Ready all your characters. They can't quest for the rest of this turn.",
  type: "action",
  colors: ["ruby"],
  cost: 7,
  illustrator: "Linh Dang",
  number: 129,
  set: "SSK",
  rarity: "rare",
  abilities: [
    {
      type: "static",
      text: "Ready all your characters. They can't quest for the rest of this turn.",
      targets: [yourCharactersTarget],
      effects: [
        { type: "ready" },
        {
          type: "restrict",
          restriction: "quest",
          duration: FOR_THE_REST_OF_THIS_TURN,
        },
      ],
    },
  ],
};
