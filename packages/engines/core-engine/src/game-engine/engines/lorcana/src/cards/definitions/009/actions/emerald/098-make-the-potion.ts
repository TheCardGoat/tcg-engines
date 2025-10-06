import { makeThePotion as makeThePotionAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/004/actions/094-make-the-potion";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const makeThePotion: LorcanaActionCardDefinition = {
  ...makeThePotionAsOrig,
  id: "iiv",
  reprints: [makeThePotionAsOrig.id],
  number: 98,
  set: "009",
};
