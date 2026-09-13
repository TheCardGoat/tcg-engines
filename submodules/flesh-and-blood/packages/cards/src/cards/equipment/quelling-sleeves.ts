import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/quelling-sleeves.generated.ts";
import { quell } from "../shared/keywords.ts";

export const quellingSleeves = defineCard(fabCardIdentitiesByCanonicalId["QdCcTgDwqq66NHp6qDdTz"], {
  keywords: [quell(1)],
});
