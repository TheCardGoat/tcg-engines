import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/teklo-base-legs.generated.ts";
import { bladeBreak } from "../shared/keywords.ts";

export const tekloBaseLegs = defineCard(fabCardIdentitiesByCanonicalId["RGPqjKtjJdcNLcrb8NGmN"], {
  keywords: [bladeBreak],
});
