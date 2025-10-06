import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
import { motherKnowsBest as motherKnowsBestAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/001/songs/095-mother-knows-best";

export const motherKnowsBest: LorcanaActionCardDefinition = {
  ...motherKnowsBestAsOrig,
  id: "px0",
  reprints: [motherKnowsBestAsOrig.id],
  number: 99,
  set: "009",
};
