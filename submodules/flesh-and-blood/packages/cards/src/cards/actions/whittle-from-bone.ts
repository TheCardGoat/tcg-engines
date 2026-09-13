import { stealth } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/whittle-from-bone.generated.ts";

export const whittleFromBone = definePitchFamily(fabPitchFamilies["whittle-from-bone"], {
  keywords: [stealth],

  abilities: () => ({
    triggerWhenMarkedAttackAttacks: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "attack",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "event-object",
            selector: "attack",
            relationship: {
              kind: "any",
            },
            filter: {
              hasStatus: "marked",
            },
          },
          target: {
            kind: "hero",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "graphene-chelicera",
          controller: "controller",
        },
      },
    },
  }),
});
export const {
  red: whittleFromBoneRed,
  yellow: whittleFromBoneYellow,
  blue: whittleFromBoneBlue,
} = whittleFromBone.cards;
