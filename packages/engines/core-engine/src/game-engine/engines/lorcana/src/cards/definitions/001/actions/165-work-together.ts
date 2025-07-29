import { FOR_THE_REST_OF_THIS_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import {
  drawCardEffect,
  gainsAbilityEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { supportAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/supportAbility";
import { chosenCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import { selfPlayerTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const workTogether: LorcanaActionCardDefinition = {
  id: "cxh",
  name: "Work Together",
  characteristics: ["action"],
  text: "Chosen character gains **Support** this turn. _(Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)_",
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
  flavour:
    "Pacha: Put your whole back into it! \nKuzco: This is my whole back!",
  inkwell: true,
  colors: ["sapphire"],
  cost: 1,
  illustrator: "Bill Robinson",
  number: 165,
  set: "TFC",
  rarity: "common",
};
