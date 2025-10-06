import { youCanFly as youCanFlyAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/002/actions/133-you-can-fly";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const youCanFly: LorcanaActionCardDefinition = {
  ...youCanFlyAsOrig,
  id: "uv6",
  reprints: [youCanFlyAsOrig.id],
  number: 131,
  set: "009",
};
