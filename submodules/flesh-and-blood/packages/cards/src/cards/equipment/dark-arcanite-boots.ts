import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/dark-arcanite-boots.generated.ts";
import { shadowResist } from "../shared/keywords.ts";

export const darkArcaniteBoots = defineCard(
  fabCardIdentitiesByCanonicalId["KLHKTQbWrzWNBrLkGJt8Q"],
  {
    keywords: [shadowResist(1)],
  },
);
