import { temper } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/dynastic-diadem.generated.ts";

export const dynasticDiadem = defineCard(fabCardIdentitiesByCanonicalId["HPN7nhMQcqfdzzkQh6TjB"], {
  keywords: [temper],
  abilities: {
    fealtyTokensControlCanTBeDestroyedByOpponents: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "rule-modification",
        mode: "restrict",
        action: "be-destroyed",
        filter: {
          name: "Fealty",
        },
        source: "opponents-effects",
        duration: "while-in-arena",
      },
    },
    ifControl3MoreFealtyTokensGets1: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "zone-count",
        zone: "permanent",
        player: "controller",
        filter: {
          name: "Fealty",
          typeBox: {
            metatypes: ["Token"],
          },
        },
        comparison: {
          op: "gte",
          value: 3,
        },
      },
      effect: {
        type: "modify-numeric",
        property: "defense",
        op: "add",
        amount: 1,
        target: {
          selector: "self",
        },
        // Continuous while-condition (CR 5.4.7 / lignum-vitae pattern): re-eval
        // while equipped — not a this-turn grant that drops at EOT.
        duration: "permanent",
      },
    },
  },
});
