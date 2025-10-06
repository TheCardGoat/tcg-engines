import { theQueenMirrorSeeker as theQueenMirrorSeekerAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const theQueenMirrorSeeker: LorcanaCharacterCardDefinition = {
  ...theQueenMirrorSeekerAsOrig,
  id: "yku",
  reprints: [theQueenMirrorSeekerAsOrig.id],
  number: 149,
  set: "009",
};
