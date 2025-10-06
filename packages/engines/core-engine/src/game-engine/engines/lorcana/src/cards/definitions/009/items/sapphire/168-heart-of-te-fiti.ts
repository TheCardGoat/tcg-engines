import { heartOfTeFiti as heartOfTeFitiAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/003/items/164-heart-of-te-fiti";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const heartOfTeFiti: LorcanaItemCardDefinition = {
  ...heartOfTeFitiAsOrig,
  id: "cl8",
  reprints: [heartOfTeFitiAsOrig.id],
  number: 168,
  set: "009",
};
