import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/tokens/spectral-shield.generated.ts";
import { ward } from "../shared/keywords.ts";

export const spectralShield = defineCard(fabCardIdentitiesByCanonicalId["NwwnMqBg9tdRBp9NWHpgf"], {
  keywords: [ward(1)],
});
