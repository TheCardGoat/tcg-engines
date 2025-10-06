import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
import { digALittleDeeper as ogDigALittleDeeper } from "~/game-engine/engines/lorcana/src/cards/definitions/004/actions/162-dig-a-little-deeper";

export const digALittleDeeper: LorcanaActionCardDefinition = {
  ...ogDigALittleDeeper,
  id: "pbu",
  reprints: [ogDigALittleDeeper.id],
  number: 166,
  set: "009",
};
