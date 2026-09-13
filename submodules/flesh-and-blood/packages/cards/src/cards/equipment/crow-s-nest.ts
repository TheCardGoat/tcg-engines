import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/crow-s-nest.generated.ts";

export const crowSNest = defineCard(fabCardIdentitiesByCanonicalId["QqNbkbMnDhQrdrBj77Qpr"], {
  keywords: [
    {
      name: "specialization",
      hero: "Azalea",
    },
  ],
  abilities: {
    wheneverArrowIsPutFaceUpIntoArsenalFrom: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "move-zone",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "event-object",
            selector: "moved-object",
            relationship: {
              kind: "any",
            },
            filter: {
              typeBox: {
                subtypes: ["Arrow"],
              },
              hasStatus: "face-up",
            },
            bindAs: "it",
          },
          to: "arsenal",
          from: ["deck"],
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "pay",
            cost: {
              class: "asset",
              type: "resources",
              amount: 1,
            },
            payer: "controller",
          },
          then: {
            type: "add-counter",
            counter: {
              kind: "named",
              name: "aim",
            },
            count: 1,
            target: {
              selector: "binding",
              binding: "it",
            },
          },
        },
      },
    },
  },
});
