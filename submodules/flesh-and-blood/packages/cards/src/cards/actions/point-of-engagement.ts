import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/point-of-engagement.generated.ts";

export const pointOfEngagement = definePitchFamily(fabPitchFamilies["point-of-engagement"], {
  parameters: { red: { value1: 3 }, yellow: { value1: 2 }, blue: { value1: 1 } },
  keywords: [goAgain],
  abilities: ({ value1 }) => ({
    modifyNumericPowerThisTurn: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: value1,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              subtypes: ["Dagger"],
            },
          },
        },
      },
    },
    modifyNumericPowerThisTurnAll: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: { selector: "this-attack" },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              subtypes: ["Attack"],
            },
            hasStatus: "attacking-a-marked-hero",
          },
          count: { type: "all" },
        },
      },
    },
  }),
});

export const {
  red: pointOfEngagementRed,
  yellow: pointOfEngagementYellow,
  blue: pointOfEngagementBlue,
} = pointOfEngagement.cards;
