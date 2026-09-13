import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/helm-of-the-arknight.generated.ts";
import { temper } from "../shared/keywords.ts";

export const helmOfTheArknight = defineCard(
  fabCardIdentitiesByCanonicalId["ffLDbK7CGgrjL7R68jKJC"],
  {
    keywords: [temper],
  },
);
