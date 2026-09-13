import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/steelbraid-buckler.generated.ts";
import { temper } from "../shared/keywords.ts";

export const steelbraidBuckler = defineCard(
  fabCardIdentitiesByCanonicalId["fDMpDJm8JHF7zkQcDq8mn"],
  {
    keywords: [temper],
  },
);
