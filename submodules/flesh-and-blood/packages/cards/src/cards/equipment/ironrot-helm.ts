import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/ironrot-helm.generated.ts";
import { bladeBreak } from "../shared/keywords.ts";

export const ironrotHelm = defineCard(fabCardIdentitiesByCanonicalId["pCDQncQ7WrwtmPrmgjQjQ"], {
  keywords: [bladeBreak],
});
