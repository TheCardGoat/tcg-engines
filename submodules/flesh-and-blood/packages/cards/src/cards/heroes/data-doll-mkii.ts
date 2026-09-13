import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/data-doll-mkii.generated.ts";

export const dataDollMkii = defineCard(fabCardIdentitiesByCanonicalId["kbdzm8R7MHCpWC79RdTGH"], {
  abilities: {
    wheneverMechanologistItemCost2LessPutBanishedZoneDeckPutArena: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          kind: "any-of",
          patterns: [
            {
              name: "banish",
              actor: {
                kind: "any",
              },
              observes: {
                kind: "event-object",
                selector: "moved-object",
                relationship: {
                  kind: "zone-owner",
                  player: "ability-controller",
                },
                filter: {
                  and: [
                    {
                      typeBox: {
                        supertypes: ["Mechanologist"],
                      },
                    },
                    {
                      typeBox: {
                        subtypes: ["Item"],
                      },
                    },
                  ],
                  numeric: [
                    {
                      property: "cost",
                      basis: "base",
                      comparison: { op: "lte", value: 2 },
                    },
                  ],
                },
                bindAs: "it",
              },
              from: ["deck"],
              to: "banished",
            },
            {
              name: "move-zone",
              actor: {
                kind: "any",
              },
              observes: {
                kind: "event-object",
                selector: "moved-object",
                relationship: {
                  kind: "zone-owner",
                  player: "ability-controller",
                },
                filter: {
                  and: [
                    {
                      typeBox: {
                        supertypes: ["Mechanologist"],
                      },
                    },
                    {
                      typeBox: {
                        subtypes: ["Item"],
                      },
                    },
                  ],
                  numeric: [
                    {
                      property: "cost",
                      basis: "base",
                      comparison: { op: "lte", value: 2 },
                    },
                  ],
                },
                bindAs: "it",
              },
              from: ["deck"],
              to: "banished",
            },
          ],
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "move-card",
          target: {
            selector: "binding",
            binding: "it",
          },
          to: {
            zone: "permanent",
          },
        },
      },
    },
  },
});
