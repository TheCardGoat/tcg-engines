import { naniProtectiveSister as ogNaniProtectiveSister } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const naniProtectiveSister: LorcanitoCharacterCardDefinition = {
  ...ogNaniProtectiveSister,
  id: "pws",
  reprints: [ogNaniProtectiveSister.id],
  number: 17,
  set: "009",
};
