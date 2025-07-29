import { putCardEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const letItGo: LorcanaActionCardDefinition = {
  id: "n1y",
  name: "Let It Go",
  characteristics: ["action", "song"],
  text: "Put chosen character into their player's inkwell facedown and exerted.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Put chosen character into their player's inkwell facedown and exerted.",
      targets: [chosenCharacterTarget],
      effects: [
        putCardEffect({
          to: "inkwell",
          from: "play",
        }),
      ],
    },
  ],
  flavour:
    "It's time to see what I can do<br />To test the limits and break through",
  inkwell: true,
  colors: ["sapphire"],
  cost: 5,
  illustrator: "Milica Celikovic",
  number: 163,
  set: "TFC",
  rarity: "rare",
};
