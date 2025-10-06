import { brunosReturn as ogBrunosReturn } from "~/game-engine/engines/lorcana/src/cards/definitions/004/actions/026-brunos-return";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const brunosReturn: LorcanaActionCardDefinition = {
  ...ogBrunosReturn,
  id: "cr8",
  reprints: [ogBrunosReturn.id],
  number: 29,
  set: "009",
};
