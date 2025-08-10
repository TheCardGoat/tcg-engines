import { returnCardEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenDamagedCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const wakeUpAlice: LorcanaActionCardDefinition = {
  id: "a3c",
  name: "Wake Up, Alice!",
  characteristics: ["action"],
  text: "Return chosen damaged character to their player's hand.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Return chosen damaged character to their player's hand.",
      targets: [chosenDamagedCharacterTarget],
      effects: [
        returnCardEffect({
          to: "hand",
          from: "play",
        }),
      ],
    },
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 1,
  illustrator: "Valentina Graziano",
  number: 116,
  set: "007",
  rarity: "common",
};
