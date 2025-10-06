import { benjaGuardianOfTheDragonGem as ogBenjaGuardianOfTheDragonGem } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/174-benja-guardian-of-the-dragon-gem";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const benjaGuardianOfTheDragonGem: LorcanaCharacterCardDefinition = {
  ...ogBenjaGuardianOfTheDragonGem,
  id: "tik",
  reprints: [ogBenjaGuardianOfTheDragonGem.id],
  number: 180,
  set: "009",
};
