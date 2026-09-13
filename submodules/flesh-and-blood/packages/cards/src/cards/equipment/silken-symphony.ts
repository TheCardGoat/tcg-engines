import { ward } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/silken-symphony.generated.ts";

export const silkenSymphony = defineCard(fabCardIdentitiesByCanonicalId["rf6WpqLLPHDgGbF89b6jD"], {
  keywords: [ward(1)],
  abilities: {
    whenIsDestroyedCreateMightToken: {
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
          token: "might",
          controller: "controller",
        },
      },
    },
  },
});
