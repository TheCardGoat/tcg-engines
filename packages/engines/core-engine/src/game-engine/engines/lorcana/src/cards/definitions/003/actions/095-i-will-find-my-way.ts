import { THIS_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import {
  getEffect,
  moveToLocationEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenCharacterOfYoursTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const iWillFindMyWay: LorcanaActionCardDefinition = {
  id: "qdn",
  name: "I Will Find My Way",
  characteristics: ["action", "song"],
  text: "_(A character with cost 1 or more can {E} to sing this song for free.)_\n\n\nChosen character of yours gets +2 {S} this turn. They may move to a location for free.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Chosen character of yours gets +2 {S} this turn. They may move to a location for free.",
      targets: [chosenCharacterOfYoursTarget],
      effects: [
        getEffect({
          targets: [chosenCharacterOfYoursTarget],
          attribute: "strength",
          value: 2,
          duration: THIS_TURN,
        }),
        moveToLocationEffect({
          targets: [chosenCharacterOfYoursTarget],
          cost: 0,
          optional: true,
        }),
      ],
    },
  ],
  flavour: "I would go most anywhere \nTo feel like I belong",
  inkwell: true,
  colors: ["emerald"],
  cost: 1,
  illustrator: "Carmine Pucci",
  number: 95,
  set: "ITI",
  rarity: "common",
};
