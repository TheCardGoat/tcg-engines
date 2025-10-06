import {
  getLoreThisTurn,
  moveDamageEffect,
} from "@lorcanito/lorcana-engine/effects/effects";

import { ifYouHaveCharacterNamed } from "~/game-engine/engines/lorcana/src/abilities/conditions/conditions";
import {
  chosenCharacter,
  chosenOpposingCharacter,
} from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mysticalRose: LorcanaItemCardDefinition = {
  id: "d8l",
  missingTestCase: true,
  name: "Mystical Rose",
  characteristics: ["item"],
  text: "**DISPEL THE ENTANGLEMENT** Banish this item − Chosen character named Beast gets +2 {L} this turn. If you have a character named Belle in play, move up to 3 damage counters from chosen character to chosen opposing character.",
  type: "item",
  abilities: [
    {
      type: "activated",
      costs: [{ type: "banish" }],
      name: "Dispel The Entanglement",
      text: "Banish this item − Chosen character named Beast gets +2 {L} this turn. If you have a character named Belle in play, move up to 3 damage counters from chosen character to chosen opposing character.",
      effects: [
        getLoreThisTurn(2, {
          type: "card",
          value: 1,
          filters: [
            { filter: "type", value: "character" },
            { filter: "zone", value: "play" },
            {
              filter: "attribute",
              value: "name",
              comparison: { operator: "eq", value: "beast" },
            },
          ],
        }),
        moveDamageEffect({
          amount: 3,
          from: chosenCharacter,
          to: chosenOpposingCharacter,
          conditions: [ifYouHaveCharacterNamed("belle")],
        }),
      ],
    },
  ],
  flavour:
    "Ink surrounded Belle's last hope to heal the Beast. With no other choice, she reached out for it . . .",
  inkwell: true,
  colors: ["amethyst"],
  cost: 2,
  illustrator: "Olivier Désirée",
  number: 64,
  set: "URR",
  rarity: "rare",
};
