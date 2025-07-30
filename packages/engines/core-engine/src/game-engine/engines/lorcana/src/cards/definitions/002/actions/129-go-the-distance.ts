import { FOR_THE_REST_OF_THIS_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import {
  drawCardEffect,
  readyAndCantQuest,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenDamagedCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import { selfPlayerTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const goTheDistance: LorcanaActionCardDefinition = {
  id: "k1y",
  name: "Go the Distance",
  characteristics: ["action", "song"],
  text: "Ready chosen damaged character of yours. They can't quest for the rest of this turn. Draw a card.",
  type: "action",
  inkwell: true,
  colors: ["ruby"],
  cost: 2,
  illustrator: "Gaku Kumatori",
  number: 129,
  set: "ROF",
  rarity: "common",
  abilities: [
    {
      type: "static",
      text: "Ready chosen damaged character of yours. They can't quest for the rest of this turn. Draw a card.",
      effects: [
        ...readyAndCantQuest({
          targets: [chosenDamagedCharacterTarget],
          duration: FOR_THE_REST_OF_THIS_TURN,
        }),
        drawCardEffect({ targets: [selfPlayerTarget] }),
      ],
    },
  ],
};
