import { suddenChill as suddenChillAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/001/songs/098-sudden-chill";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const suddenChill: LorcanaActionCardDefinition = {
  ...suddenChillAsOrig,
  id: "f3l",
  reprints: [suddenChillAsOrig.id],
  number: 95,
  set: "009",
};
