import { ward } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/silken-shawl.generated.ts";

export const silkenShawl = defineCard(fabCardIdentitiesByCanonicalId["kLbJBc8mpCQPMf8bmKchp"], {
  keywords: [ward(1)],
  abilities: {
    whenIsDestroyedCreateVigorToken: {
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
          type: "create-token",
          token: "vigor",
          controller: "controller",
        },
      },
    },
  },
});
