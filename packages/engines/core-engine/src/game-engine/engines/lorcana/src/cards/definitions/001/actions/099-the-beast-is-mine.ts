import { DURING_THEIR_NEXT_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import { gainsAbilityEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { recklessAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/recklessAbility";
import { chosenCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const theBeastIsMine: LorcanaActionCardDefinition = {
  id: "mlb",
  name: "The Beast is Mine!",
  characteristics: ["action"],
  text: "Chosen character gains **Reckless** during their next turn. _(They can't quest and must challenge if able.)_",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Chosen character gains **Reckless** during their next turn. _(They can't quest and must challenge if able.)_",
      targets: [chosenCharacterTarget],
      effects: [
        gainsAbilityEffect({
          ability: recklessAbility,
          duration: DURING_THEIR_NEXT_TURN,
        }),
      ],
    },
  ],
  flavour:
    "It's only fitting that the finest hunter gets the foulest \rbeast!<br />\r− Gaston",
  inkwell: true,
  colors: ["emerald"],
  cost: 3,
  illustrator: "\tMatthew Robert Davies",
  number: 99,
  set: "TFC",
  rarity: "uncommon",
};
