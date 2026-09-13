import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/dyadic-carapace.generated.ts";
import { arcaneBarrier, temper } from "../shared/keywords.ts";

export const dyadicCarapace = defineCard(fabCardIdentitiesByCanonicalId["C7NCzqwTbKtcQKjwHRzBK"], {
  keywords: [arcaneBarrier(2), temper],
});
