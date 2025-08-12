import { FOR_THE_REST_OF_THIS_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import {
  dealDamageEffect,
  restrictEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { yourCharactersTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const onYourFeetNow: LorcanaActionCardDefinition = {
  id: "wna",
  missingTestCase: true,
  name: "On Your Feet! Now!",
  characteristics: ["action"],
  text: "Ready all your characters and deal 1 damage to each of them. They can't quest for the rest of this turn.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Ready all your characters and deal 1 damage to each of them. They can't quest for the rest of this turn.",
      targets: [yourCharactersTarget],
      effects: [
        { type: "ready", targets: [yourCharactersTarget] },
        dealDamageEffect({
          targets: [yourCharactersTarget],
          value: 1,
        }),
        restrictEffect({
          targets: [yourCharactersTarget],
          restriction: "quest",
          duration: FOR_THE_REST_OF_THIS_TURN,
        }),
      ],
    },
  ],
  flavour: "Catch them! Before they get away!",
  colors: ["ruby"],
  illustrator: "Lisanne Koeteeuw",
  number: 130,
  cost: 4,
  set: "ITI",
  rarity: "rare",
};
