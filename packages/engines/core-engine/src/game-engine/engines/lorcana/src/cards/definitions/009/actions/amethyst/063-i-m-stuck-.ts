import { imStuck as imStuckAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/002/actions/063-im-stuck";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const imStuck: LorcanaActionCardDefinition = {
  ...imStuckAsOrig,
  id: "sai",
  reprints: [imStuckAsOrig.id],
  number: 63,
  set: "009",
};
