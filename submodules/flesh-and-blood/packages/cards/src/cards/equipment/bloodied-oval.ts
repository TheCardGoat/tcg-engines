import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/bloodied-oval.generated.ts";

export const bloodiedOval = defineCard(fabCardIdentitiesByCanonicalId["fgm7jmdTQgBBcd6JPdjcW"], {
  keywords: [bladeBreak],
  abilities: {
    bloodiedOvalSIsEqualNumberOpposingHeroesGreater: {
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
