import { banishEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const outOfOrder: LorcanaActionCardDefinition = {
  id: "hvy",
  name: "Out Of Order",
  characteristics: ["action"],
  text: "Banish chosen character.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Banish chosen character.",
      targets: [chosenCharacterTarget],
      effects: [banishEffect()],
    },
  ],
  inkwell: true,
  colors: ["ruby"],
  cost: 7,
  illustrator: "Hedvig H.S",
  number: 148,
  set: "007",
  rarity: "common",
};
