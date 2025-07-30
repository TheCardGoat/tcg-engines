import {
  dealDamageEffect,
  drawCardEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import { selfPlayerTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const letTheStormRageOn: LorcanaActionCardDefinition = {
  id: "dlc",
  name: "Let the Storm Rage On",
  characteristics: ["action", "song"],
  text: "Deal 2 damage to chosen character. Draw a card.",
  type: "action",
  flavour: "The cold never bothered me anyway",
  colors: ["steel"],
  cost: 3,
  illustrator: "R. la Barbera / L. Giammichele",
  number: 199,
  set: "ROF",
  rarity: "common",
  abilities: [
    {
      type: "static",
      text: "Deal 2 damage to chosen character. Draw a card.",
      effects: [
        dealDamageEffect({ targets: chosenCharacterTarget, value: 2 }),
        drawCardEffect({ targets: [selfPlayerTarget] }),
      ],
    },
  ],
};
