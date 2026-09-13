import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/theryon-magister-of-justice.generated.ts";

export const theryonMagisterOfJustice = defineCard(
  fabCardIdentitiesByCanonicalId["DbqmMdc6Mw9jGpPQBcwRd"],
  {
    abilities: {
      firstTimeTurnAnotherDestroysDontPayResourceResourceDestroyNonPermanent: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "destroy",
            actor: {
              kind: "player",
              player: "opponent",
            },
            observes: {
              kind: "event-object",
              selector: "moved-object",
              relationship: {
                kind: "any",
              },
              filter: {
                hasStatus: "not-controlled-by-destroyer",
              },
            },
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
                amount: 2,
              },
              payer: "controller",
            },
            then: {
              // "They destroy a non-hero permanent they control" — scan opponent
              // permanents from Theryon's layer controller, but the opponent
              // answers which permanent is destroyed (explicit chooser).
              type: "destroy",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "opponent",
                chooser: "opponent",
                zones: ["permanent"],
                filter: {
                  typeBox: {
                    excludeTypes: ["Hero"],
                  },
                },
                count: 1,
              },
            },
          },
        },
        limit: {
          count: 1,
          per: "turn",
          ordinals: [1],
        },
      },
    },
  },
);
