import { DURING_THEIR_NEXT_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import {
  discardCardEffect,
  exertCardEffect,
  restrictEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import {
  chosenCharacterTarget,
  chosenExertedCharacterTarget,
} from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import { selfPlayerTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const loseTheWay: LorcanaActionCardDefinition = {
  id: "la7",
  name: "Lose The Way",
  characteristics: ["action"],
  text: "Exert chosen character. Then, you may choose and discard a card. If you do, the exerted character can't ready at the start of their next turn.",
  type: "action",
  inkwell: true,
  colors: ["amethyst"],
  cost: 2,
  illustrator: "Douglas De La Hoz",
  number: 63,
  set: "006",
  rarity: "uncommon",
  abilities: [
    {
      type: "static",
      text: "Exert chosen character. Then, you may choose and discard a card. If you do, the exerted character can't ready at the start of their next turn.",
      effects: [
        exertCardEffect({
          targets: [chosenCharacterTarget],
        }),
        discardCardEffect({
          targets: [selfPlayerTarget],
          value: 1,
          optional: true,
          followedBy: restrictEffect({
            targets: [chosenExertedCharacterTarget],
            restriction: "ready",
            duration: DURING_THEIR_NEXT_TURN,
          }),
        }),
      ],
    },
  ],
};
