import { coconutbasket as ogCoconutBasket } from "~/game-engine/engines/lorcana/src/cards/definitions/001/items/166-coconut-basket";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const coconutBasket: LorcanaItemCardDefinition = {
  ...ogCoconutBasket,
  id: "bxv",
  reprints: [ogCoconutBasket.id],
  number: 169,
  set: "009",
};
