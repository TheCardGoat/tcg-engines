import { magicMirror as ogMagicMirror } from "~/game-engine/engines/lorcana/src/cards/definitions/001/items/066-magic-mirror";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const magicMirror: LorcanaItemCardDefinition = {
  ...ogMagicMirror,
  id: "z3v",
  reprints: [ogMagicMirror.id],
  number: 65,
  set: "009",
};
