import { mulanEliteArcher as ogMulanEliteArcher } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/224-mulan-elite-archer";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mulanEliteArcher: LorcanitoCharacterCardDefinition = {
  ...ogMulanEliteArcher,
  id: "t4r",
  reprints: [ogMulanEliteArcher.id],
  number: 126,
  set: "009",
};
