import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/quelling-slippers.generated.ts";
import { quell } from "../shared/keywords.ts";

export const quellingSlippers = defineCard(
  fabCardIdentitiesByCanonicalId["DMht6KBFhqWNdGBJNL7NB"],
  {
    keywords: [quell(1)],
  },
);
