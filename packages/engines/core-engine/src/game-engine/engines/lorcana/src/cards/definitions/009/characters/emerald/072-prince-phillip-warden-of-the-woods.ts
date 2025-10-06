import { princePhillipWardenOfTheWoods as ogPrincePhillipWardenOfTheWoods } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/088-prince-phillip-warden-of-the-woods";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const princePhillipWardenOfTheWoods: LorcanitoCharacterCardDefinition = {
  ...ogPrincePhillipWardenOfTheWoods,
  id: "l8f",
  reprints: [ogPrincePhillipWardenOfTheWoods.id],
  number: 72,
  set: "009",
};
