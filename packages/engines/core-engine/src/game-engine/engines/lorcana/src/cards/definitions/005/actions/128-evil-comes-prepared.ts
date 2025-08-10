import { FOR_THE_REST_OF_THIS_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import {
  conditionalTargetEffect,
  gainLoreEffect,
  restrictEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenCharacterOfYoursTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import { selfPlayerTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const evilComesPrepared: LorcanaActionCardDefinition = {
  id: "xc5",
  missingTestCase: true,
  name: "Evil Comes Prepared",
  characteristics: ["action"],
  text: "Ready chosen character of yours. They can't quest for the rest of this turn. If a Villain character is chosen, gain 1 lore.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Ready chosen character of yours. They can't quest for the rest of this turn. If a Villain character is chosen, gain 1 lore.",
      targets: [chosenCharacterOfYoursTarget],
      effects: [
        { type: "ready", targets: [chosenCharacterOfYoursTarget] },
        restrictEffect({
          targets: [chosenCharacterOfYoursTarget],
          restriction: "quest",
          duration: FOR_THE_REST_OF_THIS_TURN,
        }),
        conditionalTargetEffect({
          targetCondition: {
            type: "hasClassification",
            classification: "villain",
          },
          effect: gainLoreEffect({
            targets: [selfPlayerTarget],
            value: 1,
          }),
        }),
      ],
    },
  ],
  inkwell: true,
  colors: ["ruby"],
  cost: 2,
  lore: 1,
  illustrator: "Adam Bunch",
  number: 128,
  set: "SSK",
  rarity: "common",
};
