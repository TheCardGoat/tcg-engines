import { returnCardEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import {
  anotherChosenCharacterTarget,
  chosenCharacterOfYoursTarget,
} from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const bounce: LorcanaActionCardDefinition = {
  id: "fpf",
  name: "Bounce",
  characteristics: ["action"],
  text: "Return chosen character of yours to your hand to return another chosen character to their player's hand.",
  type: "action",
  flavour: "Are you ready for some bouncing?\n−Tigger",
  colors: ["emerald"],
  cost: 2,
  illustrator: "Bill Robinson",
  number: 97,
  set: "ROF",
  rarity: "uncommon",
  abilities: [
    {
      type: "static",
      text: "Return chosen character of yours to your hand to return another chosen character to their player's hand.",
      effects: [
        returnCardEffect({
          targets: [chosenCharacterOfYoursTarget],
          from: "play",
          to: "hand",
          followedBy: returnCardEffect({
            targets: [anotherChosenCharacterTarget],
            from: "play",
            to: "hand",
          }),
        }),
      ],
    },
  ],
};
