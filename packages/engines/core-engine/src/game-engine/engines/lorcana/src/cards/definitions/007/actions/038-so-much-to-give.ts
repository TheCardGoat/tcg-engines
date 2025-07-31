import { UNTIL_START_OF_YOUR_NEXT_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import {
  drawCardEffect,
  gainsAbilityEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { bodyguardAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/bodyguardAbility";
import { chosenCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import { selfPlayerTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const soMuchToGive: LorcanaActionCardDefinition = {
  id: "qi0",
  name: "So Much To Give",
  characteristics: ["song", "action"],
  text: "(A character with cost 2 or more can {E} to sing this song for free.)\nDraw a card. Chosen character gains Bodyguard until the start of your next turn.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Draw a card. Chosen character gains Bodyguard until the start of your next turn.",
      effects: [
        drawCardEffect({ targets: [selfPlayerTarget] }),
        gainsAbilityEffect({
          targets: [chosenCharacterTarget],
          ability: bodyguardAbility,
          duration: UNTIL_START_OF_YOUR_NEXT_TURN,
        }),
      ],
    },
  ],
  inkwell: true,
  colors: ["amber"],
  cost: 2,
  illustrator: "Andrea Femerstrand",
  number: 38,
  set: "007",
  rarity: "common",
};
