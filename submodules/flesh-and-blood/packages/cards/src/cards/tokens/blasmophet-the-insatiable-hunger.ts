import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/tokens/blasmophet-the-insatiable-hunger.generated.ts";
import { unique } from "../shared/keywords.ts";

export const blasmophetTheInsatiableHunger = defineCard(
  fabCardIdentitiesByCanonicalId.FnQHkwDkfJcRFcrRDtPtT,
  {
    keywords: [unique],
    abilities: {
      playBloodDebtFromBanish: {
        kind: "static",
        staticKind: "play",
        playEffect: {
          role: "permission",
          fromZones: ["banished"],
          filter: {
            typeBox: {
              types: ["Action"],
            },
            hasKeyword: "blood-debt",
          },
        },
        limit: {
          count: 1,
          per: "turn",
        },
      },
      banishOrDestroyAtEndPhase: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "end-phase",
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
            type: "sequence",
            steps: [
              {
                type: "optional",
                effect: {
                  type: "banish",
                  target: {
                    selector: "object",
                    declared: "at-resolution",
                    player: "controller",
                    zones: ["hand"],
                    count: 1,
                  },
                },
              },
              {
                type: "conditional",
                condition: {
                  type: "not",
                  condition: {
                    type: "compare-amount",
                    amount: {
                      type: "count",
                      what: "cards-in-zone",
                      zone: "banished",
                      per: "turn",
                      filter: { hasKeyword: "blood-debt" },
                    },
                    comparison: { op: "gte", value: 1 },
                  },
                },
                then: {
                  type: "destroy",
                  target: {
                    selector: "self",
                  },
                },
              },
            ],
          },
        },
      },
    },
  },
);
