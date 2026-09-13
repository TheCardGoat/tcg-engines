import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/ironrot-gauntlet.generated.ts";
import { bladeBreak } from "../shared/keywords.ts";

export const ironrotGauntlet = defineCard(fabCardIdentitiesByCanonicalId["wJHGzDnNr7fkPFnkLzMWq"], {
  keywords: [bladeBreak],
});
