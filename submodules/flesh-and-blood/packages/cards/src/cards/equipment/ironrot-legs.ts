import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/ironrot-legs.generated.ts";
import { bladeBreak } from "../shared/keywords.ts";

export const ironrotLegs = defineCard(fabCardIdentitiesByCanonicalId["rBMjbzt9h6cKWqz6JmCTc"], {
  keywords: [bladeBreak],
});
