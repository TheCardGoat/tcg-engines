import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
import { makeThePotion as makeThePotionAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/004/actions/094-make-the-potion";

export const makeThePotion: LorcanaActionCardDefinition = {
  ...makeThePotionAsOrig,
  id: "iiv",
  reprints: [makeThePotionAsOrig.id],
  number: 98,
  set: "009",
};
