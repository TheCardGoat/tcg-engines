import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/robe-of-resourcefulness.generated.ts";

export const robeOfResourcefulness = defineCard(
  fabCardIdentitiesByCanonicalId["tPk9crbnHLtHTFPgJRWHC"],
  {
    keywords: [bladeBreak],
    abilities: {
      whenLeavesArenaGain: {
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
            type: "gain-resources",
            amount: 2,
          },
        },
      },
    },
  },
);
