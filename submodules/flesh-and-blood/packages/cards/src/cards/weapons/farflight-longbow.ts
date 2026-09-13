import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/farflight-longbow.generated.ts";

export const farflightLongbow = defineCard(
  fabCardIdentitiesByCanonicalId["pLKmGWGTTQdcHmhckhcNh"],
  {
    abilities: {
      instantResourceTapPutArrowHandFaceUpArsenal: {
        kind: "activated",
        abilityType: "instant",
        cost: {
          class: "mixed",
          type: "all",
          costs: [
            {
              class: "asset",
              type: "resources",
              amount: 1,
            },
            {
              class: "effect",
              type: "tap-self",
            },
          ],
        },
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
      arrowAttacksTargetAnyOpposingAlly: {
        kind: "static",
        staticKind: "continuous",
        effect: {
          type: "rule-modification",
          mode: "allow",
          action: "attack-target",
          filter: {
            typeBox: {
              subtypes: ["Arrow"],
            },
          },
          duration: "while-in-arena",
        },
      },
    },
  },
);
