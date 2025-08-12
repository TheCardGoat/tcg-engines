import { banishEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenItemOrLocationTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const riseOfTheTitans: LorcanaActionCardDefinition = {
  id: "ukw",
  name: "Rise of the Titans",
  characteristics: ["action"],
  text: "Banish chosen location or item.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Banish chosen location or item.",
      targets: [chosenItemOrLocationTarget],
      effects: [banishEffect()],
    },
  ],
  flavour: "Oh, we're in trouble, big trouble! \n–Hermes",
  inkwell: true,
  colors: ["steel"],
  cost: 3,
  illustrator: "Nicola Saviori",
  number: 198,
  set: "ITI",
  rarity: "uncommon",
};
