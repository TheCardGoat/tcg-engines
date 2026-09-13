import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/quelling-robe.generated.ts";
import { quell } from "../shared/keywords.ts";

export const quellingRobe = defineCard(fabCardIdentitiesByCanonicalId["k8d9d7n7fJRwkRDWG7Kcn"], {
  keywords: [quell(1)],
});
