import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/teklo-base-head.generated.ts";
import { bladeBreak } from "../shared/keywords.ts";

export const tekloBaseHead = defineCard(fabCardIdentitiesByCanonicalId["DkcTJhjgpTcfrhDFffL6q"], {
  keywords: [bladeBreak],
});
