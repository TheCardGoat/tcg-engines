import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/gloves-of-erasure.generated.ts";

export const glovesOfErasure = defineCard(fabCardIdentitiesByCanonicalId["gmwg8fzdNG8rMfrHgD7kw"], {
  keywords: [bladeBreak],
  abilities: {
    whenLeavesArenaDestroyTargetAuraToken: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "leave-arena",
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
            declared: "on-stack",
            zones: ["permanent"],
            filter: {
              typeBox: {
                subtypes: ["Aura"],
              },
            },
            count: 1,
          },
        },
      },
    },
  },
});
