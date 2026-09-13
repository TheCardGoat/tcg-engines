import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/spell-fray-gloves.generated.ts";
import { spellvoid } from "../shared/keywords.ts";

export const spellFrayGloves = defineCard(fabCardIdentitiesByCanonicalId["ct8dbmGW77wb6TkJwJkFT"], {
  keywords: [spellvoid(1)],
});
