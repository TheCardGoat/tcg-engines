import { rapunzelSunshine as ogRapunzelSunshine } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/020-rapunzel-sunshine";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const rapunzelSunshine: LorcanaCharacterCardDefinition = {
  ...ogRapunzelSunshine,
  id: "p6p",
  reprints: [ogRapunzelSunshine.id],
  number: 8,
  set: "009",
};
