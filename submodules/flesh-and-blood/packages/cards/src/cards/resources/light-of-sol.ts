import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/resources/light-of-sol.generated.ts";
import { legendary } from "../shared/keywords.ts";

export const lightOfSolYellow = defineCard(
  fabCardIdentitiesByCanonicalId["76cHnpRhNn7GWNNfFbNhL"],
  {
    keywords: [legendary],
    abilities: {
      revealAndChargeYellowTopCardOnPitch: {
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
            type: "sequence",
            steps: [
              {
                type: "reveal",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["deck"],
                  position: "top",
                  count: 1,
                },
                outputBinding: "it",
              },
              {
                type: "conditional",
                condition: {
                  type: "binding-matches",
                  binding: "it",
                  filter: {
                    color: ["yellow"],
                  },
                },
                then: {
                  type: "optional",
                  effect: {
                    type: "move-card",
                    target: {
                      selector: "binding",
                      binding: "it",
                    },
                    to: {
                      zone: "soul",
                    },
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
