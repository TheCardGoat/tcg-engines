import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/t-bone.generated.ts";
import { boost } from "../shared/keywords.ts";

export const tBone = definePitchFamily(fabPitchFamilies["t-bone"], {
  keywords: [boost],
  abilities: () => ({
    triggeredStaticOnAttackEffect: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "attack",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "none",
          },
        },
        state: {
          type: "control-object",
          zones: ["combat-chain"],
          filter: {
            wasBoosted: true,
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "rule-modification",
          mode: "require",
          action: "defend",
          filter: {
            typeBox: {
              types: ["Equipment"],
            },
          },
          duration: "this-combat-chain",
        },
      },
    },
  }),
});

export const { red: tBoneRed, yellow: tBoneYellow, blue: tBoneBlue } = tBone.cards;
