import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/shroud-of-the-fate-watcher.generated.ts";

export const shroudOfTheFateWatcher = defineCard(
  fabCardIdentitiesByCanonicalId["dBmtb8rdJtFtKh7Lqjw6r"],
  {
    keywords: [bladeBreak],
    abilities: {
      whenLeavesArenaCreateSigilFateToken: {
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
            type: "create-token",
            token: "sigil-of-fate",
            controller: "controller",
          },
        },
      },
    },
  },
);
