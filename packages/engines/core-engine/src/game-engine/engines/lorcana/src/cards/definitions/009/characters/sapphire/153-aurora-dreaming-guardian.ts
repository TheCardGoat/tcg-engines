import { auroraDreamingGuardian as ogAuroraDreamingGuardian } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/139-aurora-dreaming-guardian";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const auroraDreamingGuardian: LorcanitoCharacterCardDefinition = {
  ...ogAuroraDreamingGuardian,
  id: "kjf",
  reprints: ["wb5"],
  number: 153,
  set: "009",
};
