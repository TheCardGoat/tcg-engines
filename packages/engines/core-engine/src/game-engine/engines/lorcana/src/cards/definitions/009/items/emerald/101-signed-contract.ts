import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
import { signedContract as signedContractAsOrig } from "~/game-engine/engines/lorcana/src/cards/definitions/004/items/099-signed-contract";

export const signedContract: LorcanaItemCardDefinition = {
  ...signedContractAsOrig,
  id: "no1",
  reprints: [signedContractAsOrig.id],
  number: 101,
  set: "009",
};
