import {
  dealDamageEffect,
  drawCardEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import { selfPlayerTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const quickShot: LorcanaActionCardDefinition = {
  id: "xuh",
  name: "Quick Shot",
  characteristics: ["action"],
  text: "Deal 1 damage to chosen character. Draw a card.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Deal 1 damage to chosen character. Draw a card.",
      effects: [
        dealDamageEffect({ targets: [chosenCharacterTarget], value: 1 }),
        drawCardEffect({ targets: [selfPlayerTarget] }),
      ],
    },
  ],
  inkwell: false,
  colors: ["steel"],
  cost: 2,
  illustrator: "Diego Machuca",
  number: 203,
  set: "008",
  rarity: "uncommon",
};
