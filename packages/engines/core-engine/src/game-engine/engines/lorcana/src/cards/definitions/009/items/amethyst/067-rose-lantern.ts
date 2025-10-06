import { roseLantern as ogRoseLantern } from "~/game-engine/engines/lorcana/src/cards/definitions/004/items/065-rose-lantern";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const roseLantern: LorcanaItemCardDefinition = {
  ...ogRoseLantern,
  id: "j0w",
  reprints: [ogRoseLantern.id],
  number: 67,
  set: "009",
};
