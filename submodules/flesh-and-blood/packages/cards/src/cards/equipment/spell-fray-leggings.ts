import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/spell-fray-leggings.generated.ts";
import { spellvoid } from "../shared/keywords.ts";

export const spellFrayLeggings = defineCard(
  fabCardIdentitiesByCanonicalId["8JHRBmh8WLLgMgCrP7Tpk"],
  {
    keywords: [spellvoid(1)],
  },
);
