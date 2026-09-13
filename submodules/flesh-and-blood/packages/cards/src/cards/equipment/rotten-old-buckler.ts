import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/rotten-old-buckler.generated.ts";
import { bladeBreak } from "../shared/keywords.ts";

export const rottenOldBuckler = defineCard(
  fabCardIdentitiesByCanonicalId["6nGBJrh8MDLD7JJBD6NPK"],
  {
    keywords: [bladeBreak],
  },
);
