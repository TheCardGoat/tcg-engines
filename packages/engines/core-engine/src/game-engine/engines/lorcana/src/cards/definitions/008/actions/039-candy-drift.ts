import { THIS_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import {
  banishEffect,
  drawCardEffect,
  getEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const candyDrift: LorcanaActionCardDefinition = {
  id: "sf4",
  name: "Candy Drift",
  characteristics: ["action"],
  text: "Draw a card. Chosen character of yours gets +5 {S} this turn. At the end of your turn, banish them.",
  type: "action",
  inkwell: true,
  colors: ["amber", "ruby"],
  cost: 2,
  illustrator: "Stefano Spagnuolo",
  number: 39,
  set: "008",
  rarity: "uncommon",
  abilities: [
    {
      type: "static",
      text: "Draw a card. Chosen character of yours gets +5 {S} this turn. At the end of your turn, banish them.",
      effects: [
        drawCardEffect({ value: 1 }),
        getEffect({
          targets: [
            {
              type: "card",
              zone: "play",
              cardType: "character",
              owner: "self",
              count: 1,
              optional: true,
            },
          ],
          attribute: "strength",
          value: 5,
          duration: THIS_TURN,
        }),
        // TODO: "At the end of your turn, banish them" requires delayed trigger system
        // For now, this effect needs to be implemented as an end-of-turn trigger
      ],
    },
  ],
};
