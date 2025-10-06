import { liShangImperialCaptain as liShangImperialCaptainAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/182-li-shang-imperial-captain";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const liShangImperialCaptain: LorcanaCharacterCardDefinition = {
  ...liShangImperialCaptainAsOrig,
  id: "swm",
  reprints: [liShangImperialCaptainAsOrig.id],
  number: 193,
  set: "009",
};
