import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/widow-veil-respirator.generated.ts";
import { arcaneBarrier, spellvoid } from "../shared/keywords.ts";

export const widowVeilRespirator = defineCard(
  fabCardIdentitiesByCanonicalId["J9FcLDpkPpWNwfDgBqhm9"],
  {
    keywords: [arcaneBarrier(1), spellvoid(1)],
  },
);
