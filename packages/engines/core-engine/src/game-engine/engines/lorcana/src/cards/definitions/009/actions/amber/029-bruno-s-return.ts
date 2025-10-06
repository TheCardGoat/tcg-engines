import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
import { brunosReturn as ogBrunosReturn } from "~/game-engine/engines/lorcana/src/cards/definitions/004/actions/026-brunos-return";

export const brunosReturn: LorcanaActionCardDefinition = {
  ...ogBrunosReturn,
  id: "cr8",
  reprints: [ogBrunosReturn.id],
  number: 29,
  set: "009",
};
