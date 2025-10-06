import { tinkerBellMostHelpful as ogTinkerBellMostHelpful } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/093-tinker-bell-most-helpful";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const tinkerBellMostHelpful: LorcanaCharacterCardDefinition = {
  ...ogTinkerBellMostHelpful,
  id: "rxt",
  reprints: [ogTinkerBellMostHelpful.id],
  number: 88,
  set: "009",
};
