import { moanaUndeterredVoyager as ogMoanaUndeterredVoyager } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const moanaUndeterredVoyager: LorcanaCharacterCardDefinition = {
  ...ogMoanaUndeterredVoyager,
  id: "n3t",
  reprints: [ogMoanaUndeterredVoyager.id],
  number: 116,
  set: "009",
};
