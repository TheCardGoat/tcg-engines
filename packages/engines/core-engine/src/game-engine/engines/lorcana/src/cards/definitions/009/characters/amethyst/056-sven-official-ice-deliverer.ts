import { svenOficialIceDeliverer as svenOfficialIceDelivererAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/055-sven-official-ice-deliverer";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const svenOfficialIceDeliverer: LorcanaCharacterCardDefinition = {
  ...svenOfficialIceDelivererAsOrig,
  id: "tf5",
  reprints: [svenOfficialIceDelivererAsOrig.id],
  number: 56,
  set: "009",
};
