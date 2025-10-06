import { signedContract as signedContractAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/004/items/099-signed-contract";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const signedContract: LorcanaItemCardDefinition = {
  ...signedContractAsOrig,
  id: "no1",
  reprints: [signedContractAsOrig.id],
  number: 101,
  set: "009",
};
