import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/line-crossers.generated.ts";

export const lineCrossers = defineCard(fabCardIdentitiesByCanonicalId["7DfN7NwW9WbTpDNhFW8qW"], {
  keywords: [bladeBreak],
  abilities: {
    ifHaveSameAsHeroAlsoCountsAsHaving: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "life-comparison",
        player: "self",
        vs: "opponent",
        op: "eq",
      },
      effect: {
        type: "rule-modification",
        mode: "require",
        action: "life-comparison",
        duration: "while-in-arena",
      },
    },
  },
});
