import {
  createCardEffectsForTargetPlayer,
  putCardEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenCharacterOfYoursTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import { eachPlayerTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const fallingDownTheRabbitHole: LorcanaActionCardDefinition = {
  id: "j9g",
  name: "Falling Down the Rabbit Hole",
  characteristics: ["action"],
  text: "Each player chooses one of their characters and puts them into their inkwell facedown and exerted.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Each player chooses one of their characters and puts them into their inkwell facedown and exerted.",
      targets: [eachPlayerTarget],
      effects: [
        createCardEffectsForTargetPlayer({
          effects: [
            putCardEffect({
              to: "inkwell",
              from: "play",
              exerted: true,
              targets: [chosenCharacterOfYoursTarget],
            }),
          ],
        }),
      ],
    },
  ],
  flavour:
    "Down, down, down she went, floating in a swirl of ink. How curious!",
  colors: ["sapphire"],
  cost: 4,
  illustrator: "Lissette Carrera",
  number: 162,
  set: "ROF",
  rarity: "rare",
};
