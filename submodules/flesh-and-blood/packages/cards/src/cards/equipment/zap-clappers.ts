import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/zap-clappers.generated.ts";

export const zapClappers = defineCard(fabCardIdentitiesByCanonicalId["TgrQPtPTGpMznMJPJKPGC"], {
  keywords: [bladeBreak],
  abilities: {
    whenDefendsMayRevealInstantFromHandIfDo: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "defender",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "reveal",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["hand"],
              filter: {
                typeBox: {
                  types: ["Instant"],
                },
              },
              count: 1,
            },
          },
          // "If you do" — only after accepting optional and resolving reveal.
          then: {
            type: "deal-damage",
            damageType: "arcane",
            amount: 1,
            target: {
              selector: "attacking-hero",
            },
          },
        },
      },
    },
  },
});
