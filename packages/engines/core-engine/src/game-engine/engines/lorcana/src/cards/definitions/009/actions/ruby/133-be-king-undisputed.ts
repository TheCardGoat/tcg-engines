import { beKingUndisputed as ogBeKingUndisputed } from "~/game-engine/engines/lorcana/src/cards/definitions/004/actions/129-be-king-undisputed";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const beKingUndisputed: LorcanaActionCardDefinition = {
  ...ogBeKingUndisputed,
  id: "vg8",
  reprints: [ogBeKingUndisputed.id],
  number: 133,
  set: "009",
};
