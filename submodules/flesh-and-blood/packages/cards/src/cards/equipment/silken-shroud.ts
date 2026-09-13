import { ward } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/silken-shroud.generated.ts";

export const silkenShroud = defineCard(fabCardIdentitiesByCanonicalId["cBrmgjgrfDdgTW7g9djcF"], {
  keywords: [ward(1)],
  abilities: {
    whenIsDestroyedCreatePonderToken: {
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
          token: "ponder",
          controller: "controller",
        },
      },
    },
  },
});
