import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
import { heartOfTeFiti as heartOfTeFitiAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/003/items/164-heart-of-te-fiti";

export const heartOfTeFiti: LorcanaItemCardDefinition = {
  ...heartOfTeFitiAsOrig,
  id: "cl8",
  reprints: [heartOfTeFitiAsOrig.id],
  number: 168,
  set: "009",
};
