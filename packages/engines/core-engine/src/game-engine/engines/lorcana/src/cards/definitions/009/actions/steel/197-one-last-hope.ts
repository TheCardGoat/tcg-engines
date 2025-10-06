import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
import { oneLastHope as ogOneLastHope } from "~/game-engine/engines/lorcana/src/cards/definitions/004/actions/197-one-last-hope";

export const oneLastHope: LorcanaActionCardDefinition = {
  ...ogOneLastHope,
  id: "i3n",
  reprints: [ogOneLastHope.id],
  number: 197,
  set: "009",
};
