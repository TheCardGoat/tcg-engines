import { iFindEmIFlattenEm as ogIFindEmIFlattenEm } from "~/game-engine/engines/lorcana/src/cards/definitions/004/actions/196-i-find-em-i-flatten-em";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const iFindEmIFlattenEm: LorcanaActionCardDefinition = {
  ...ogIFindEmIFlattenEm,
  id: "eok",
  reprints: [ogIFindEmIFlattenEm.id],
  number: 199,
  set: "009",
};
