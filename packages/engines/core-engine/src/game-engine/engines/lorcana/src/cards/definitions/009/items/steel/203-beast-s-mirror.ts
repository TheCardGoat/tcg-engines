import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
import { beastMirror as ogBeastMirror } from "~/game-engine/engines/lorcana/src/cards/definitions/001/items/201-beast-mirror";

export const beastsMirror: LorcanaItemCardDefinition = {
  ...ogBeastMirror,
  id: "ysy",
  reprints: [ogBeastMirror.id],
  number: 203,
  set: "009",
};
