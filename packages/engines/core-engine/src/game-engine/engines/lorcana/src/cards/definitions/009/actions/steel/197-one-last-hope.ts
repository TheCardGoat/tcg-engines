import { oneLastHope as ogOneLastHope } from "~/game-engine/engines/lorcana/src/cards/definitions/004/actions/197-one-last-hope";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const oneLastHope: LorcanaActionCardDefinition = {
  ...ogOneLastHope,
  id: "i3n",
  reprints: [ogOneLastHope.id],
  number: 197,
  set: "009",
};
