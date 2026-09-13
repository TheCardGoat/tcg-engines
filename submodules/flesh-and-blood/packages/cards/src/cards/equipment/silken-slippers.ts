import { ward } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/silken-slippers.generated.ts";

export const silkenSlippers = defineCard(fabCardIdentitiesByCanonicalId["hMcDLGCLj6b8dLHmbmjtq"], {
  keywords: [ward(1)],
  abilities: {
    whenIsDestroyedCreateAgilityToken: {
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
          token: "agility",
          controller: "controller",
        },
      },
    },
  },
});
