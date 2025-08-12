import { putCardEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenExertedCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const intoTheUnknown: LorcanaActionCardDefinition = {
  id: "rhd",
  name: "Into The Unknown",
  characteristics: ["action", "song"],
  text: "Put chosen exerted character into their player's inkwell facedown and exerted.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Put chosen exerted character into their player's inkwell facedown and exerted.",
      targets: [chosenExertedCharacterTarget],
      effects: [
        putCardEffect({
          to: "inkwell",
          from: "play",
        }),
      ],
    },
  ],
  inkwell: true,
  colors: ["amethyst", "sapphire"],
  cost: 3,
  illustrator: "Maria Dresden",
  number: 81,
  set: "008",
  rarity: "super_rare",
};
