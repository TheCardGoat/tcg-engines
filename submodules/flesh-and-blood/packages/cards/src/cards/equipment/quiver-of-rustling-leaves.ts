import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/quiver-of-rustling-leaves.generated.ts";

export const quiverOfRustlingLeaves = defineCard(
  fabCardIdentitiesByCanonicalId["Pc9dDNQmwKnmDbgf6jrLH"],
  {
    abilities: {
      instantRevealTopDeckIfSArrowPutFace: {
        kind: "activated",
        abilityType: "instant",
        cost: {
          class: "asset",
          type: "resources",
          amount: 3,
        },
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
                  typeBox: {
                    subtypes: ["Arrow"],
                  },
                },
              },
              then: {
                type: "sequence",
                steps: [
                  {
                    type: "move-card",
                    target: {
                      selector: "binding",
                      binding: "it",
                    },
                    to: {
                      zone: "arsenal",
                      visibility: "face-up",
                    },
                    outputBinding: "it",
                  },
                  {
                    type: "destroy",
                    target: {
                      selector: "self",
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    },
  },
);
