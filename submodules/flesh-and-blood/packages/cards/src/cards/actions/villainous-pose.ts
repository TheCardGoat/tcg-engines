import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/villainous-pose.generated.ts";

export const villainousPose = definePitchFamily(fabPitchFamilies["villainous-pose"], {
  keywords: [goAgain],

  abilities: () => ({
    empowerNextAttack: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 4,
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
        name: "the-crowd-boos",
      },
    },
    gainCrowdBoos: {
      kind: "resolution",
      effect: {
        type: "crowd-boos",
        target: "controller",
      },
      label: {
        name: "the-crowd-boos",
      },
    },
  }),
});
export const {
  red: villainousPoseRed,
  yellow: villainousPoseYellow,
  blue: villainousPoseBlue,
} = villainousPose.cards;
