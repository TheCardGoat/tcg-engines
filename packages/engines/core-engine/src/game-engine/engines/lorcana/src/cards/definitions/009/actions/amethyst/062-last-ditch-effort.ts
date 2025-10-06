import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
import { lastDitchEffort as ogLastDitchEffort } from "~/game-engine/engines/lorcana/src/cards/definitions/003/actions/062-last-ditch-effort";

export const lastditchEffort: LorcanaActionCardDefinition = {
  ...ogLastDitchEffort,
  id: "qq2",
  reprints: [ogLastDitchEffort.id],
  number: 62,
  set: "009",
};
