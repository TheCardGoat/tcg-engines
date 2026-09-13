import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/nullrune-boots.generated.ts";
import { arcaneBarrier } from "../shared/keywords.ts";

/** Model notes (hand-authored): Arcane Barrier 1 on Generic legs. */
export const nullruneBoots = defineCard(fabCardIdentitiesByCanonicalId["n8rcTcmmLzzwTWHCwgtRP"], {
  keywords: [arcaneBarrier(1)],
});
