import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/teklo-base-arms.generated.ts";
import { bladeBreak } from "../shared/keywords.ts";

export const tekloBaseArms = defineCard(fabCardIdentitiesByCanonicalId["ddc8cKjhFDgfDQqdpcRjB"], {
  keywords: [bladeBreak],
});
