import {
  drawCardEffect,
  revealEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import {
  eachOpponentTarget,
  selfPlayerTarget,
} from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const nothingToHide: LorcanaActionCardDefinition = {
  id: "q9s",

  name: "Nothing to Hide",
  characteristics: ["action"],
  text: "Each opponent reveals their hand. Draw a card.",
  type: "action",
  flavour: "Helps you avoid unpleasant surprises.",
  inkwell: true,
  colors: ["sapphire"],
  cost: 1,
  illustrator: "Mane Kandalyan / Jochem Van Gool",
  number: 165,
  set: "ROF",
  rarity: "common",
  abilities: [
    {
      type: "static",
      text: "Each opponent reveals their hand. Draw a card.",
      effects: [
        revealEffect({
          targets: [eachOpponentTarget],
          from: "hand",
        }),
        drawCardEffect({ targets: [selfPlayerTarget] }),
      ],
    },
  ],
};
