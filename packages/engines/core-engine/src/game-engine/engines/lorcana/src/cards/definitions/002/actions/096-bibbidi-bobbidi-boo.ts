import { previousTargetStat } from "~/game-engine/engines/lorcana/src/abilities/ability-types";
import {
  playCardEffect,
  putCardEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import {
  anotherChosenCharacterTarget,
  chosenCharacterOfYoursTarget,
} from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const bibbidiBobbidiBoo: LorcanaActionCardDefinition = {
  id: "waz",
  name: "Bibbidi Bobbidi Boo",
  characteristics: ["action", "song"],
  text: "Return chosen character of yours to your hand to play another character with the same cost or less for free.",
  type: "action",
  flavour: "It'll do magic, believe it or not",
  colors: ["emerald"],
  cost: 3,
  illustrator: "LadyShalirin",
  number: 96,
  set: "ROF",
  rarity: "rare",
  abilities: [
    {
      type: "static",
      text: "Return chosen character of yours to your hand to play another character with the same cost or less for free.",
      effects: [
        putCardEffect({
          to: "hand",
          from: "play",
          targets: [chosenCharacterOfYoursTarget],
          followedBy: playCardEffect({
            targets: [anotherChosenCharacterTarget],
            from: "hand",
            cost: "free",
            filter: {
              cardType: "character",
              cost: {
                max: previousTargetStat("cost"),
              },
            },
          }),
        }),
      ],
    },
  ],
};
