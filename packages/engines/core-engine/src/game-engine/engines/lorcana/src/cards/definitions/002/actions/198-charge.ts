import { THIS_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import { gainsAbilityEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { challengerAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/challengerAbility";
import { resistAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/resistAbility";
import { chosenCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const charge: LorcanaActionCardDefinition = {
  id: "koq",
  name: "Charge!",
  characteristics: ["action"],
  text: "Chosen character gains **Challenger** +2 and **Resist** +2 this turn. _(They get +2 {S} while challenging. Damage dealt to them is reduced by 2.)_",
  type: "action",
  flavour: "Sometimes subtlety is required. This is not one of those times.",
  inkwell: true,
  colors: ["steel"],
  cost: 2,
  illustrator: "Hedvig Häggman-Sund",
  number: 198,
  set: "ROF",
  rarity: "common",
  abilities: [
    {
      type: "static",
      text: "Chosen character gains **Challenger** +2 and **Resist** +2 this turn.",
      targets: [chosenCharacterTarget],
      effects: [
        gainsAbilityEffect({
          ability: challengerAbility(2),
          duration: THIS_TURN,
        }),
        gainsAbilityEffect({
          ability: resistAbility(2),
          duration: THIS_TURN,
        }),
      ],
    },
  ],
};
