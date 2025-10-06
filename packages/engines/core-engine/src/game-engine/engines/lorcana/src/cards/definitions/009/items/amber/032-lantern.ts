import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
import { lantern as ogLantern } from "~/game-engine/engines/lorcana/src/cards/definitions/001/items/033-lantern";

export const lantern: LorcanaItemCardDefinition = {
  ...ogLantern,
  id: "aa1",
  reprints: [ogLantern.id],
  number: 32,
  set: "009",
};
