import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/mbrio-base-walkers.generated.ts";
import { quell } from "../shared/keywords.ts";

export const mbrioBaseWalkers = defineCard(
  fabCardIdentitiesByCanonicalId["dBjPM7HpftQtBRzdTwhQj"],
  {
    keywords: [quell(1)],
  },
);
