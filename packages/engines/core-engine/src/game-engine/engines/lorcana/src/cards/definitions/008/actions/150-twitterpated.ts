import { UNTIL_START_OF_YOUR_NEXT_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import { gainsAbilityEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import { chosenCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const twitterpated: LorcanaActionCardDefinition = {
  id: "aku",
  name: "Twitterpated",
  characteristics: ["action"],
  text: "Chosen character gains Evasive until the start of your next turn.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Chosen character gains Evasive until the start of your next turn.",
      effects: [
        gainsAbilityEffect({
          targets: [chosenCharacterTarget],
          ability: evasiveAbility,
          duration: UNTIL_START_OF_YOUR_NEXT_TURN,
        }),
      ],
    },
  ],
  inkwell: true,
  colors: ["ruby"],
  cost: 1,
  illustrator: "Omar Lozano",
  number: 150,
  set: "008",
  rarity: "uncommon",
};
