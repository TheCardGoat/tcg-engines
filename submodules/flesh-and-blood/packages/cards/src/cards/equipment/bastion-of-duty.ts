import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/bastion-of-duty.generated.ts";
import { protect, temper } from "../shared/keywords.ts";

export const bastionOfDuty = defineCard(fabCardIdentitiesByCanonicalId["8QrLPLnBTwCjng6NzNtgp"], {
  keywords: [protect, temper],
});
