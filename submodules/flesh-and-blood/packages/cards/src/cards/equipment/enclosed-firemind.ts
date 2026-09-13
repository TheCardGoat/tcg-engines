import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/enclosed-firemind.generated.ts";
import { arcaneBarrier } from "../shared/keywords.ts";

export const enclosedFiremind = defineCard(
  fabCardIdentitiesByCanonicalId["K8qbPC8KHcW77BNH9czcr"],
  {
    keywords: [arcaneBarrier(1)],
  },
);
