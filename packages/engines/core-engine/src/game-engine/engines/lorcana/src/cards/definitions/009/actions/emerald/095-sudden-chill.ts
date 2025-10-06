import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
import { suddenChill as suddenChillAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/001/songs/098-sudden-chill";

export const suddenChill: LorcanaActionCardDefinition = {
  ...suddenChillAsOrig,
  id: "f3l",
  reprints: [suddenChillAsOrig.id],
  number: 95,
  set: "009",
};
