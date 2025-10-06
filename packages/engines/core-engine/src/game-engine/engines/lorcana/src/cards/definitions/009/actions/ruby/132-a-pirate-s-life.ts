import { aPiratesLife as ogAPiratesLife } from "~/game-engine/engines/lorcana/src/cards/definitions/004/actions/128-a-pirates-life";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const aPiratesLife: LorcanaActionCardDefinition = {
  ...ogAPiratesLife,
  id: "t0s",
  reprints: [ogAPiratesLife.id],
  number: 132,
  set: "009",
};
