import { readyAndCantQuest } from "@lorcanito/lorcana-engine/effects/effects";
import { FOR_THE_REST_OF_THIS_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import { chosenCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const fanTheFlames: LorcanaActionCardDefinition = {
  id: "afx",
  name: "Fan The Flames",
  characteristics: ["action"],
  text: "Ready chosen character. They can't quest for the rest of this turn.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Ready chosen character. They can't quest for the rest of this turn.",
      targets: [chosenCharacterTarget],
      effects: [
        { type: "ready" },
        {
          type: "restrict",
          restriction: "quest",
          duration: FOR_THE_REST_OF_THIS_TURN,
        },
      ],
    },
  ],
  flavour: "Pretty words can move a crowd, but so can ugly ones.",
  inkwell: true,
  colors: ["ruby"],
  cost: 1,
  illustrator: "Jenna Gray",
  number: 131,
  set: "TFC",
  rarity: "uncommon",
};
