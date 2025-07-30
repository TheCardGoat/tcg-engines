import { THIS_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import { challengeOverrideEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const pickAFight: LorcanaActionCardDefinition = {
  id: "mmh",

  name: "Pick a Fight",
  characteristics: ["action"],
  text: "Chosen character can challenge ready characters this turn.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Chosen character can challenge ready characters this turn.",
      targets: [chosenCharacterTarget],
      effects: [
        challengeOverrideEffect({
          canChallenge: "ready",
          duration: THIS_TURN,
        }),
      ],
    },
  ],
  flavour: "I'm gonna wreck it!",
  colors: ["steel"],
  cost: 2,
  illustrator: "Pablo Hidalgo / Jeff Merghart",
  number: 200,
  set: "ROF",
  rarity: "uncommon",
};
