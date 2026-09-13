import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/driving-blade.generated.ts";
import { goAgain } from "../shared/keywords.ts";
export const drivingBlade = definePitchFamily(fabPitchFamilies["driving-blade"], {
  parameters: pitchMap({ red: 3, yellow: 2, blue: 1 }),
  keywords: [goAgain],
  abilities: (amount) => ({
    resolutionSequence: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount,
            target: {
              selector: "this-attack",
            },
            duration: "this-turn",
            appliesTo: {
              next: {
                typeBox: {
                  types: ["Weapon"],
                },
              },
            },
          },
          {
            type: "grant-property",
            property: {
              kind: "keyword",
              keyword: goAgain,
            },
            target: {
              selector: "this-attack",
            },
            duration: "this-turn",
            appliesTo: {
              next: {
                typeBox: {
                  types: ["Weapon"],
                },
              },
            },
          },
        ],
      },
    },
  }),
});
export const {
  red: drivingBladeRed,
  yellow: drivingBladeYellow,
  blue: drivingBladeBlue,
} = drivingBlade.cards;
