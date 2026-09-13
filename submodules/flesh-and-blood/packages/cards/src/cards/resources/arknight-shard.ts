import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/resources/arknight-shard.generated.ts";
import { legendary } from "../shared/keywords.ts";

export const arknightShardBlue = defineCard(fabCardIdentitiesByCanonicalId.pkMGCRh9fDT98dRgnQF8W, {
  keywords: [
    legendary,
    {
      name: "specialization",
      hero: "Viserai",
    },
  ],
  abilities: {
    createRunechantOnPitch: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "pitch",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "none",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "runechant",
          controller: "controller",
        },
      },
    },
  },
});
