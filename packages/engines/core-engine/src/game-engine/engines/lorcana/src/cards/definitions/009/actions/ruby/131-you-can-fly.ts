import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
import { youCanFly as youCanFlyAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/002/actions/133-you-can-fly";

export const youCanFly: LorcanaActionCardDefinition = {
  ...youCanFlyAsOrig,
  id: "uv6",
  reprints: [youCanFlyAsOrig.id],
  number: 131,
  set: "009",
};
