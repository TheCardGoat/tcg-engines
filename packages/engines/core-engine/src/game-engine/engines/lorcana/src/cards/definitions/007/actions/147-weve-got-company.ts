import { THIS_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import { gainsAbilityEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { recklessAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/recklessAbility";
import { yourCharactersTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const weveGotCompany: LorcanaActionCardDefinition = {
  id: "vhs",
  name: "We've Got Company!",
  characteristics: ["action"],
  text: "Ready all your characters. They gain Reckless this turn. (They can't quest and must challenge if able.)",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Ready all your characters. They gain Reckless this turn. (They can't quest and must challenge if able.)",
      targets: [yourCharactersTarget],
      effects: [
        { type: "ready" },
        gainsAbilityEffect({
          ability: recklessAbility,
          duration: THIS_TURN,
        }),
      ],
    },
  ],
  inkwell: false,
  colors: ["ruby"],
  cost: 3,
  illustrator: "Isaiah Mesq",
  number: 147,
  set: "007",
  rarity: "rare",
};
