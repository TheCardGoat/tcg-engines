import { tinkerBellGenerousFairy as ogTinkerBellGenerousFairy } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const tinkerBellGenerousFairy: LorcanaCharacterCardDefinition = {
  ...ogTinkerBellGenerousFairy,
  id: "grh",
  reprints: [ogTinkerBellGenerousFairy.id],
  number: 12,
  set: "009",
};
