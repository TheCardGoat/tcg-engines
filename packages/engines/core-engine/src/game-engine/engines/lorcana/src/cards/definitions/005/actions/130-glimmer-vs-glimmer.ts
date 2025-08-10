import { banishEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import {
  chosenCharacterOfYoursTarget,
  chosenCharacterTarget,
} from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const glimmerVsGlimmer: LorcanaActionCardDefinition = {
  id: "opx",
  missingTestCase: true,
  name: "Glimmer VS Glimmer",
  characteristics: ["action"],
  text: "Banish chosen character of yours to banish chosen character.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Banish chosen character of yours to banish chosen character.",
      effects: [
        banishEffect({
          targets: [chosenCharacterOfYoursTarget],
          followedBy: banishEffect({ targets: [chosenCharacterTarget] }),
        }),
      ],
    },
  ],
  flavour:
    'Hades: "Listen, kid. If I’m gettin’ banished back to the lorebook, you’re going with me."\nHercules: "We’ll see about that."',
  colors: ["ruby"],
  cost: 4,
  illustrator: "Ian MacDonald",
  number: 130,
  set: "SSK",
  rarity: "uncommon",
};
