import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/nullrune-robe.generated.ts";
import { arcaneBarrier } from "../shared/keywords.ts";

export const nullruneRobe = defineCard(fabCardIdentitiesByCanonicalId["TKd8jdfqgWnjdNRBmkKfB"], {
  keywords: [arcaneBarrier(1)],
});
