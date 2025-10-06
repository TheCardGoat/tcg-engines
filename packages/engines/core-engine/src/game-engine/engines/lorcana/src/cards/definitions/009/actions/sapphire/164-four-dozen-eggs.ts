import { fourDozenEggs as ogFourDozenEggs } from "~/game-engine/engines/lorcana/src/cards/definitions/002/actions/163-four-dozen-eggs";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const fourDozenEggs: LorcanaActionCardDefinition = {
  ...ogFourDozenEggs,
  id: "wfa",
  reprints: [ogFourDozenEggs.id],
  number: 164,
  set: "009",
};
