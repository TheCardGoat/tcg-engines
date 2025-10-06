import { priceEricDashingAndBrave as ogPrinceEricDashingAndBrave } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/187-prince-eric-dashing-and-brave";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const princeEricDashingAndBrave: LorcanaCharacterCardDefinition = {
  ...ogPrinceEricDashingAndBrave,
  id: "rfl",
  reprints: [ogPrinceEricDashingAndBrave.id],
  number: 194,
  set: "009",
};
