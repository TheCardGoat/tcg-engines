import { DURING_THEIR_NEXT_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import {
  drawCardEffect,
  gainsAbilityEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { recklessAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/recklessAbility";
import { chosenCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import { selfPlayerTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const nightHowlerRage: LorcanaActionCardDefinition = {
  id: "g2v",
  name: "Night Howler Rage",
  characteristics: ["action"],
  text: "Draw a card. Chosen character gains **Reckless** during their next turn._(They can't quest and must challenge if able.)_",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Draw a card. Chosen character gains **Reckless** during their next turn._(They can't quest and must challenge if able.)_",
      effects: [
        drawCardEffect({ targets: [selfPlayerTarget] }),
        gainsAbilityEffect({
          targets: [chosenCharacterTarget],
          ability: recklessAbility,
          duration: DURING_THEIR_NEXT_TURN,
        }),
      ],
    },
  ],
  flavour:
    '"I think someone is targeting predators on purpose and making them go savage!" \n−Judy Hopps',
  inkwell: true,
  colors: ["emerald"],
  cost: 3,
  illustrator: "Antoine Couttolenc",
  number: 95,
  set: "SSK",
  rarity: "common",
};
