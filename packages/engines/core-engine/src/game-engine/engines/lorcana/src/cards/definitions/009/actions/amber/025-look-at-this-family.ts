import { lookAtThisFamily as ogLookAtThisFamily } from "~/game-engine/engines/lorcana/src/cards/definitions/004/actions/028-look-at-this-family";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const lookAtThisFamily: LorcanaActionCardDefinition = {
  ...ogLookAtThisFamily,
  id: "h6u",
  reprints: [ogLookAtThisFamily.id],
  number: 25,
  set: "009",
};
