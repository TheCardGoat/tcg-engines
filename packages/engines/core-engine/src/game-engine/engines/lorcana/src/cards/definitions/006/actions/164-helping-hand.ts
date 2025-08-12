import { FOR_THE_REST_OF_THIS_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import {
  drawCardEffect,
  gainsAbilityEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { supportAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/supportAbility";
import { chosenCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import { selfPlayerTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const helpingHand: LorcanaActionCardDefinition = {
  id: "vl0",
  name: "Helping Hand",
  characteristics: ["action"],
  text: "Chosen character gains Support this turn. Draw a card.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Chosen character gains Support this turn. Draw a card.",
      effects: [
        gainsAbilityEffect({
          targets: [chosenCharacterTarget],
          ability: supportAbility,
          duration: FOR_THE_REST_OF_THIS_TURN,
        }),
        drawCardEffect({ targets: [selfPlayerTarget] }),
      ],
    },
  ],
  inkwell: false,
  colors: ["sapphire"],
  cost: 1,
  illustrator: "Therese Vildefall",
  number: 164,
  set: "006",
  rarity: "common",
};
