import { banishEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenDamagedCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const ringTheBell: LorcanaActionCardDefinition = {
  id: "bvn",
  name: "Ring The Bell",
  characteristics: ["action"],
  text: "Banish chosen damaged character.",
  type: "action",
  flavour: "I'm afraid that you've gone and upset me. \n– Ratigan",
  inkwell: true,
  colors: ["emerald"],
  cost: 3,
  illustrator: "Brian Weisz",
  number: 101,
  set: "ROF",
  rarity: "uncommon",
  abilities: [
    {
      type: "static",
      text: "Banish chosen damaged character.",
      targets: [chosenDamagedCharacterTarget],
      effects: [banishEffect()],
    },
  ],
};
