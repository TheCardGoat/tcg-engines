import { olafFriendlySnowman as olafFriendlySnowmanAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/052-olaf-friendly-snowman";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const olafFriendlySnowman: LorcanitoCharacterCardDefinition = {
  ...olafFriendlySnowmanAsOrig,
  id: "q9w",
  reprints: [olafFriendlySnowmanAsOrig.id],
  number: 55,
  set: "009",
};
