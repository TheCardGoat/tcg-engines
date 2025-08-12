import { THIS_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import {
  contextualEffect,
  getEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { yourCharactersTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const olympusWouldBeThatWay: LorcanaActionCardDefinition = {
  id: "w88",
  name: "Olympus Would Be That Way",
  characteristics: ["action"],
  text: "Your characters get +3 {S} this turn while challenging a location.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Your characters get +3 {S} this turn while challenging a location.",
      targets: [yourCharactersTarget],
      effects: [
        contextualEffect({
          targets: [yourCharactersTarget],
          context: {
            type: "whileChallenging",
            cardType: "location",
          },
          effect: getEffect({
            targets: [yourCharactersTarget],
            attribute: "strength",
            value: 3,
            duration: THIS_TURN,
          }),
        }),
      ],
    },
  ],
  flavour:
    "Now that I set you free, what is the first thing you are going to do? \n–Hades",
  inkwell: true,
  colors: ["steel"],
  cost: 1,
  illustrator: "Michaela Martin",
  number: 197,
  set: "ITI",
  rarity: "common",
};
