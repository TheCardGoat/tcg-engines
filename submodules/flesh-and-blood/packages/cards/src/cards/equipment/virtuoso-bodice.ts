import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/virtuoso-bodice.generated.ts";

export const virtuosoBodice = defineCard(fabCardIdentitiesByCanonicalId["qrgHbhCHptKd9Lj7hzDQQ"], {
  keywords: [bladeBreak],
  abilities: {
    whenDefendsMayRemoveSuspenseCounterFromAuraControl: {
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
            type: "remove-counters",
            counter: {
              kind: "named",
              name: "suspense",
            },
            count: 1,
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["permanent"],
              filter: {
                typeBox: {
                  subtypes: ["Aura"],
                },
                hasCounter: "suspense",
              },
              count: 1,
            },
          },
          then: {
            type: "gain-resources",
            amount: 2,
          },
        },
      },
    },
  },
});
