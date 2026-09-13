import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/ironrot-plate.generated.ts";
import { bladeBreak } from "../shared/keywords.ts";

export const ironrotPlate = defineCard(fabCardIdentitiesByCanonicalId["k8mnLNbhrPPrtF9W9jbnH"], {
  keywords: [bladeBreak],
});
