import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
import { fourDozenEggs as ogFourDozenEggs } from "~/game-engine/engines/lorcana/src/cards/definitions/002/actions/163-four-dozen-eggs";

export const fourDozenEggs: LorcanaActionCardDefinition = {
  ...ogFourDozenEggs,
  id: "wfa",
  reprints: [ogFourDozenEggs.id],
  number: 164,
  set: "009",
};
