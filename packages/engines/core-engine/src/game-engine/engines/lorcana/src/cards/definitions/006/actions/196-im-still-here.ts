import { UNTIL_START_OF_YOUR_NEXT_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import {
  drawCardEffect,
  gainsAbilityEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { resistAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/resistAbility";
import { chosenCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import { selfPlayerTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const imStillHere: LorcanaActionCardDefinition = {
  id: "aht",
  missingTestCase: true,
  name: "I'm Still Here",
  characteristics: ["song", "action"],
  text: "Chosen character gains Resist +2 until the start of your next turn. Draw a card.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Chosen character gains Resist +2 until the start of your next turn. Draw a card. (Damage dealt to them is reduced by 2.)",
      resolveEffectsIndividually: true,
      effects: [
        gainsAbilityEffect({
          ability: resistAbility(2),
          duration: UNTIL_START_OF_YOUR_NEXT_TURN,
          targets: [chosenCharacterTarget],
        }),
        drawCardEffect({
          targets: [selfPlayerTarget],
        }),
      ],
    },
  ],
  inkwell: true,
  colors: ["steel"],
  cost: 3,
  strength: 0,
  illustrator: "Mike Packer",
  number: 196,
  set: "006",
  rarity: "uncommon",
};
