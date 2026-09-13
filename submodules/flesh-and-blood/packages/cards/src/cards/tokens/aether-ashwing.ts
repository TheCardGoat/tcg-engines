import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/tokens/aether-ashwing.generated.ts";
import { arcaneBarrier } from "../shared/keywords.ts";

export const aetherAshwing = defineCard(fabCardIdentitiesByCanonicalId["pLwDDWbJgbKkQCpzDrc7Q"], {
  keywords: [arcaneBarrier(1)],
});
