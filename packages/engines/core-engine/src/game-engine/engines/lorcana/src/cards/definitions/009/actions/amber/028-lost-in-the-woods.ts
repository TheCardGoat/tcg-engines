import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
import { lostInTheWoods as ogLostInTheWoods } from "~/game-engine/engines/lorcana/src/cards/definitions/004/actions/029-lost-in-the-woods";

export const lostInTheWoods: LorcanaActionCardDefinition = {
  ...ogLostInTheWoods,
  id: "vre",
  reprints: [ogLostInTheWoods.id],
  number: 28,
  set: "009",
};
