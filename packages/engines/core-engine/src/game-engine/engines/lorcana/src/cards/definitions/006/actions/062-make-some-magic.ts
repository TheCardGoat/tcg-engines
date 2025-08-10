import {
  drawCardEffect,
  moveDamageEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import { selfPlayerTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const makeSomeMagic: LorcanaActionCardDefinition = {
  id: "nle",
  missingTestCase: true,
  name: "Making Magic",
  characteristics: ["action"],
  text: "Move 1 damage counter from chosen character to chosen opposing character. Draw a card.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Move 1 damage counter from chosen character to chosen opposing character. Draw a card.",
      effects: [
        ...moveDamageEffect({
          fromTargets: [chosenCharacterTarget],
          toTargets: [
            {
              type: "card",
              cardType: "character",
              owner: "opponent",
              count: 1,
            },
          ],
          value: 1,
        }),
        drawCardEffect({ targets: [selfPlayerTarget] }),
      ],
    },
  ],
  inkwell: true,
  colors: ["amethyst"],
  cost: 3,
  illustrator: "Mario Oscar Gabriele",
  number: 62,
  set: "006",
  rarity: "common",
};
