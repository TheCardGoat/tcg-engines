import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/heroic-pose.generated.ts";

export const heroicPose = definePitchFamily(fabPitchFamilies["heroic-pose"], {
  keywords: [goAgain],
  abilities: () => ({
    modifyNumericPowerThisTurnTheCrowdCheers: {
      kind: "resolution",

      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 3,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              subtypes: ["Attack"],
            },
          },
        },
      },
      label: {
        name: "the-crowd-cheers",
      },
    },
    crowdCheersTheCrowdCheers: {
      kind: "resolution",

      effect: {
        type: "crowd-cheers",
        target: "controller",
      },
      label: {
        name: "the-crowd-cheers",
      },
    },
  }),
});

export const {
  red: heroicPoseRed,
  yellow: heroicPoseYellow,
  blue: heroicPoseBlue,
} = heroicPose.cards;
