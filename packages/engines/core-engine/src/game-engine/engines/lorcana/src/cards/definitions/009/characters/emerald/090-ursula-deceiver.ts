import { ursulaDeceiver as ogUrsulaDeceiver } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const ursulaDeceiver: LorcanaCharacterCardDefinition = {
  ...ogUrsulaDeceiver,
  id: "r8u",
  reprints: [ogUrsulaDeceiver.id],
  number: 90,
  set: "009",
};
