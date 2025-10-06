import { beastMirror as ogBeastMirror } from "~/game-engine/engines/lorcana/src/cards/definitions/001/items/201-beast-mirror";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const beastsMirror: LorcanaItemCardDefinition = {
  ...ogBeastMirror,
  id: "ysy",
  reprints: [ogBeastMirror.id],
  number: 203,
  set: "009",
};
