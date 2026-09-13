import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/arcane-lantern.generated.ts";
import { arcaneBarrier } from "../shared/keywords.ts";

/** Model notes (hand-authored): Arcane Barrier 1 on a Generic off-hand. */
export const arcaneLantern = defineCard(fabCardIdentitiesByCanonicalId["qkLmDfFnGLhCCFtHPtLj7"], {
  keywords: [arcaneBarrier(1)],
});
