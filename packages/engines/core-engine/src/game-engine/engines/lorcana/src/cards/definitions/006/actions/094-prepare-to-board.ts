import { FOR_THE_REST_OF_THIS_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import {
  conditionalTargetEffect,
  getEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const prepareToBoard: LorcanaActionCardDefinition = {
  id: "xwq",
  name: "Prepare To Board!",
  characteristics: ["action"],
  text: "Chosen character gets +2 {S} this turn. If a Pirate character is chosen, they get +3 {S} instead.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Chosen character gets +2 {S} this turn. If a Pirate character is chosen, they get +3 {S} instead.",
      targets: [chosenCharacterTarget],
      effects: [
        conditionalTargetEffect({
          targetCondition: {
            type: "hasClassification",
            classification: "pirate",
          },
          effect: getEffect({
            attribute: "strength",
            value: 3,
            duration: FOR_THE_REST_OF_THIS_TURN,
          }),
          elseEffect: getEffect({
            attribute: "strength",
            value: 2,
            duration: FOR_THE_REST_OF_THIS_TURN,
          }),
        }),
      ],
    },
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 1,
  illustrator: "Toni Bruno",
  number: 94,
  set: "006",
  rarity: "common",
};
