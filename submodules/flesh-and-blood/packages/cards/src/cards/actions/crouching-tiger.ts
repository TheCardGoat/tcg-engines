import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/actions/crouching-tiger.generated.ts";
import { ephemeral, goAgain } from "../shared/keywords.ts";

export const crouchingTiger = defineCard(fabCardIdentitiesByCanonicalId["fw9LtHDQTMHgTrdcK9gP6"], {
  keywords: [ephemeral, goAgain],
});
