import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
import { improvise as ogImprovise } from "~/game-engine/engines/lorcana/src/cards/definitions/002/actions/099-improvise";

export const improvise: LorcanaActionCardDefinition = {
  ...ogImprovise,
  id: "tdy",
  reprints: [ogImprovise.id],
  number: 96,
  set: "009",
};
