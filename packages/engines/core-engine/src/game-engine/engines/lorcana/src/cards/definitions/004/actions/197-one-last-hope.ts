import { UNTIL_START_OF_YOUR_NEXT_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import {
  challengeOverrideEffect,
  conditionalTargetEffect,
  gainsAbilityEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { resistAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/resistAbility";
import { chosenCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const oneLastHope: LorcanaActionCardDefinition = {
  id: "b2r",
  name: "One Last Hope",
  characteristics: ["action", "song"],
  text: "Chosen character gains **Resist** +2 until the start of your next turn. If a Hero character is chosen, they may also challenge ready characters this turn. _(Damage dealt to them is reduced by 2.)_",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Chosen character gains **Resist** +2 until the start of your next turn. If a Hero character is chosen, they may also challenge ready characters this turn.",
      targets: [chosenCharacterTarget],
      effects: [
        gainsAbilityEffect({
          ability: resistAbility(2),
          duration: UNTIL_START_OF_YOUR_NEXT_TURN,
        }),
        conditionalTargetEffect({
          targetCondition: {
            type: "hasClassification",
            classification: "hero",
          },
          effect: challengeOverrideEffect({
            canChallenge: "ready",
            duration: UNTIL_START_OF_YOUR_NEXT_TURN,
          }),
        }),
      ],
    },
  ],
  colors: ["steel"],
  cost: 3,
  illustrator: "Alice Pisoni",
  number: 197,
  set: "URR",
  rarity: "rare",
};
