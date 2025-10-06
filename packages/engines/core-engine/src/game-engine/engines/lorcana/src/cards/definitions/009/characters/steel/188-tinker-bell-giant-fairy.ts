import { tinkerBellGiantFairy as ogTinkerBellGiantFairy } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/193-tinker-bell-giant-fairy";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const tinkerBellGiantFairy: LorcanitoCharacterCardDefinition = {
  ...ogTinkerBellGiantFairy,
  id: "rtd",
  reprints: [ogTinkerBellGiantFairy.id],
  number: 188,
  set: "009",
};
