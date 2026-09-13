import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/new-horizon.generated.ts";

export const newHorizon = defineCard(fabCardIdentitiesByCanonicalId["BqJ76BGQWgFpPddRMQrQc"], {
  keywords: [bladeBreak],
  abilities: {
    ifHaveFaceUpArsenalHaveAdditionalArsenalZone: {
      kind: "static",
      staticKind: "continuous",
      // Continuous rule raises arsenal capacity by 1 while at least one
      // face-up arsenal card exists (not have-in-deck residue).
      effect: {
        type: "conditional",
        condition: {
          type: "zone-count",
          zone: "arsenal",
          player: "controller",
          filter: {
            hasStatus: "face-up",
          },
          comparison: {
            op: "gte",
            value: 1,
          },
        },
        then: {
          type: "rule-modification",
          mode: "allow",
          action: "additional-arsenal-zone",
          duration: "permanent",
        },
      },
    },
    whenIsDestroyedDestroyAllArsenal: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "destroy",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "source",
            selector: "moved-object",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "destroy",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["arsenal"],
            count: {
              type: "all",
            },
          },
        },
      },
    },
  },
});
