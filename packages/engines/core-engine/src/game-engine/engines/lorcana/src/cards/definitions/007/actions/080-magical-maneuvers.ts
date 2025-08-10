import {
  exertCardEffect,
  returnCardEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import {
  chosenCharacterOfYoursTarget,
  chosenCharacterTarget,
} from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const magicalManeuvers: LorcanaActionCardDefinition = {
  id: "y05",
  name: "Magical Maneuvers",
  characteristics: ["action"],
  text: "Return chosen character of yours to your hand. Exert chosen character.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Return chosen character of yours to your hand. Exert chosen character.",
      targets: [],
      effects: [
        returnCardEffect({
          targets: [chosenCharacterOfYoursTarget],
          from: "play",
          to: "hand",
          followedBy: exertCardEffect({
            targets: [chosenCharacterTarget],
          }),
        }),
      ],
    },
  ],
  inkwell: true,
  colors: ["amethyst"],
  cost: 2,
  illustrator: "Jennifer Wu",
  number: 80,
  set: "007",
  rarity: "uncommon",
};
