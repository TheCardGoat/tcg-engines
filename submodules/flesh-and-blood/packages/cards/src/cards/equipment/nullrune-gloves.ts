import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/nullrune-gloves.generated.ts";
import { arcaneBarrier } from "../shared/keywords.ts";

/** Model notes (hand-authored): Arcane Barrier 1 on Generic arms. */
export const nullruneGloves = defineCard(fabCardIdentitiesByCanonicalId["9bWHjnFmfDBDtkmKtCCrw"], {
  keywords: [arcaneBarrier(1)],
});
