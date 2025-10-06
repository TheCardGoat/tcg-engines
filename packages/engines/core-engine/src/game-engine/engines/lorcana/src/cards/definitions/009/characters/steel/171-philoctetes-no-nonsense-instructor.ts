import { philoctetesNoNonsenseInstructor as philoctetesNononsenseInstructorAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/190-philoctetes-no-nonsense-instructor";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const philoctetesNononsenseInstructor: LorcanitoCharacterCardDefinition =
  {
    ...philoctetesNononsenseInstructorAsOrig,
    id: "g10",
    reprints: [philoctetesNononsenseInstructorAsOrig.id],
    number: 171,
    set: "009",
  };
