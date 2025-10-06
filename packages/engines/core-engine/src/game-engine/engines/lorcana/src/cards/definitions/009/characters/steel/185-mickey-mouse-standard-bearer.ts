import { mickeyMouseStandardBearer as ogMickeyMouseStandardBearer } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/188-mickey-mouse-standard-bearer";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mickeyMouseStandardBearer: LorcanaCharacterCardDefinition = {
  ...ogMickeyMouseStandardBearer,
  id: "fax", // New ID for this card
  reprints: [ogMickeyMouseStandardBearer.id],
  number: 185,
  set: "009",
};
