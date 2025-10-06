import { poorUnfortunateSouls as ogPoorUnfortunateSouls } from "~/game-engine/engines/lorcana/src/cards/definitions/004/actions/060-poor-unfortunate-souls";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const poorUnfortunateSouls: LorcanaActionCardDefinition = {
  ...ogPoorUnfortunateSouls,
  id: "k1n",
  reprints: [ogPoorUnfortunateSouls.id],
  number: 61,
  set: "009",
};
