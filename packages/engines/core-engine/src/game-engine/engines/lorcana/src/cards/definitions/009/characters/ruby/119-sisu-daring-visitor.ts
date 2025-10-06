import { sisuDaringVisitor as sisuDaringVisitorAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/123-sisu-daring-visitor";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const sisuDaringVisitor: LorcanaCharacterCardDefinition = {
  ...sisuDaringVisitorAsOrig,
  id: "eyu",
  reprints: [sisuDaringVisitorAsOrig.id],
  number: 119,
  set: "009",
};
