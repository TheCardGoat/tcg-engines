import { banishEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenCharacterWhoHasChallengedTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const lastStand: LorcanaActionCardDefinition = {
  id: "yh3",
  name: "Last Stand",
  characteristics: ["action"],
  text: "Banish chosen character who was challenged this turn.",
  type: "action",
  flavour: "Let's finish this, binturi.\n–Namaari",
  colors: ["amber"],
  cost: 2,
  illustrator: "Aisha Durmagambetova",
  number: 29,
  set: "ROF",
  rarity: "uncommon",
  abilities: [
    {
      type: "static",
      text: "Banish chosen character who was challenged this turn.",
      targets: [chosenCharacterWhoHasChallengedTarget],
      effects: [banishEffect()],
    },
  ],
};
