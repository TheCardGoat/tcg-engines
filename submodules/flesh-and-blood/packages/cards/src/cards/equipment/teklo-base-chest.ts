import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/teklo-base-chest.generated.ts";
import { bladeBreak } from "../shared/keywords.ts";

export const tekloBaseChest = defineCard(fabCardIdentitiesByCanonicalId["LHBn8grtppJpC8gBmzfrd"], {
  keywords: [bladeBreak],
});
