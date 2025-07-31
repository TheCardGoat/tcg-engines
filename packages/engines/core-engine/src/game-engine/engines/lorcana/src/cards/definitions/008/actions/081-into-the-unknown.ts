import { chosenExertedCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { putTargetCardIntoTheirInkwell } from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const intoTheUnknown: LorcanaActionCardDefinition = {
  id: "rhd",
  name: "Into The Unknown",
  characteristics: ["action", "song"],
  text: "Put chosen exerted character into their player's inkwell facedown and exerted.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      effects: [
        putTargetCardIntoTheirInkwell({
          target: chosenExertedCharacter,
          exerted: true,
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
