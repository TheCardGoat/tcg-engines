import { strengthOfARagingFire as ogStrengthOfARagingFire } from "~/game-engine/engines/lorcana/src/cards/definitions/002/actions/201-strength-of-a-raging-fire";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const strengthOfARagingFire: LorcanaActionCardDefinition = {
  ...ogStrengthOfARagingFire,
  id: "fua",
  reprints: [ogStrengthOfARagingFire.id],
  number: 201,
  set: "009",
};
