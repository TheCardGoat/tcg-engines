import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/headliner-helm.generated.ts";

export const headlinerHelm = defineCard(fabCardIdentitiesByCanonicalId["BB7nwJkKWfznpRkt6gcCF"], {
  keywords: [bladeBreak],
  abilities: {
    headlinerHelmSIsEqualNumberOpposingHeroesGreater: {
      kind: "static",
      staticKind: "property",
      property: "defense",
      value: {
        type: "count",
        what: "heroes",
        player: "opponent",
        filter: {
          hasStatus: "greater-life-than-controller",
        },
      },
    },
  },
});
