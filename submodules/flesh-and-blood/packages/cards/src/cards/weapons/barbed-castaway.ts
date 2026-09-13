import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/barbed-castaway.generated.ts";

export const barbedCastaway = defineCard(fabCardIdentitiesByCanonicalId["jPfMCnKDptNbCbp6T96dT"], {
  abilities: {
    oncePerTurnInstantResourcePutArrowHandFaceUpArsenal: {
      kind: "activated",
      limit: {
        count: 1,
        per: "turn",
      },
      abilityType: "instant",
      cost: {
        class: "asset",
        type: "resources",
        amount: 1,
      },
      effect: {
        type: "optional",
        effect: {
          type: "move-card",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["hand"],
            filter: {
              typeBox: {
                subtypes: ["Arrow"],
              },
            },
            count: 1,
          },
          to: {
            zone: "arsenal",
            visibility: "face-up",
          },
          outputBinding: "it",
        },
      },
    },
    oncePerTurnInstantResourceTurnFaceDownArrowArsenalFaceUpPutAimCounter: {
      kind: "activated",
      limit: {
        count: 1,
        per: "turn",
      },
      abilityType: "instant",
      cost: {
        class: "asset",
        type: "resources",
        amount: 1,
      },
      effect: {
        type: "optional",
        effect: {
          type: "turn-face-up",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["arsenal"],
            filter: {
              hasStatus: "face-down",
              typeBox: {
                subtypes: ["Arrow"],
              },
            },
            count: 1,
          },
          outputBinding: "it",
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
});
