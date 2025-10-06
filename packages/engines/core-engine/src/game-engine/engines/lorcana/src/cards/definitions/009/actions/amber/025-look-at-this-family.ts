import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
import { lookAtThisFamily as ogLookAtThisFamily } from "~/game-engine/engines/lorcana/src/cards/definitions/004/actions/028-look-at-this-family";

export const lookAtThisFamily: LorcanaActionCardDefinition = {
  ...ogLookAtThisFamily,
  id: "h6u",
  reprints: [ogLookAtThisFamily.id],
  number: 25,
  set: "009",
};
