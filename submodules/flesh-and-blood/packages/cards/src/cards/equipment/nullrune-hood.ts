import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/nullrune-hood.generated.ts";
import { arcaneBarrier } from "../shared/keywords.ts";

/** Model notes (hand-authored): Arcane Barrier 1 on a Generic head. */
export const nullruneHood = defineCard(fabCardIdentitiesByCanonicalId["9DNnTrggQrJWn8CMFJJhf"], {
  keywords: [arcaneBarrier(1)],
});
