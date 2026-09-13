import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/conditions/marked.generated.ts";

// This is the public card-face representation of CR 9.3's condition, not a
// card that can be played to create it. Its lifecycle is rules-engine state.
export const marked = defineCard(fabCardIdentitiesByCanonicalId.d7MHfCqtjhKzp6cLRJQCQ, {});
