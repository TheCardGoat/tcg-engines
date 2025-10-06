import { robinHoodDaydreamer as ogRobinHoodDaydreamer } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const robinHoodDaydreamer: LorcanitoCharacterCardDefinition = {
  ...ogRobinHoodDaydreamer,
  id: "x4m",
  reprints: [ogRobinHoodDaydreamer.id],
  number: 70,
  set: "009",
};
