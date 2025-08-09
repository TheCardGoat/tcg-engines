import {
  drawCardEffect,
  moveDamageEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import { selfPlayerTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const bestowAGift: LorcanaActionCardDefinition = {
  id: "v46",
  missingTestCase: true,
  name: "Bestow a Gift",
  characteristics: ["action"],
  text: "Move 1 damage counter from chosen character to chosen opposing character.",
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
  flavour:
    '"From magic ink I call this gift \nFly my minion, thy wings be swift!" \n- Maleficent',
  inkwell: true,
  colors: ["amethyst"],
  cost: 1,
  illustrator: "Dylan Bonner",
  number: 60,
  set: "ITI",
  rarity: "common",
};
