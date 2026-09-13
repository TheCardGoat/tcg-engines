import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/spell-fray-cloak.generated.ts";
import { spellvoid } from "../shared/keywords.ts";

export const spellFrayCloak = defineCard(fabCardIdentitiesByCanonicalId["HL7qqDC6G6pCMKFFRrNLg"], {
  keywords: [spellvoid(1)],
});
