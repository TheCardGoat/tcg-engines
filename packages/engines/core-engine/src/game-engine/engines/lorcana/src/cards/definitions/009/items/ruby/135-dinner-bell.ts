import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
import { dinnerBell as ogDinnerBell } from "~/game-engine/engines/lorcana/src/cards/definitions/002/items/134-dinner-bell";

export const dinnerBell: LorcanaItemCardDefinition = {
  ...ogDinnerBell,
  id: "box",
  reprints: [ogDinnerBell.id],
  number: 135,
  set: "009",
};
