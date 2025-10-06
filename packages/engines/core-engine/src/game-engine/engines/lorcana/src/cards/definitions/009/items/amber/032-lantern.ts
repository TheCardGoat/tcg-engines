import { lantern as ogLantern } from "~/game-engine/engines/lorcana/src/cards/definitions/001/items/033-lantern";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const lantern: LorcanaItemCardDefinition = {
  ...ogLantern,
  id: "aa1",
  reprints: [ogLantern.id],
  number: 32,
  set: "009",
};
