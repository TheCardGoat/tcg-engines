import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/tokens/spellbane-aegis.generated.ts";
import { spellvoid } from "../shared/keywords.ts";

export const spellbaneAegis = defineCard(fabCardIdentitiesByCanonicalId["pdMgMzHwDgBpCNjD7WGLD"], {
  keywords: [spellvoid(1)],
});
