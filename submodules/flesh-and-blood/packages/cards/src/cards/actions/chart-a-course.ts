import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/chart-a-course.generated.ts";

export const chartACourse = definePitchFamily(fabPitchFamilies["chart-a-course"], {
  keywords: [goAgain],
  abilities: () => ({
    modifyNumericPower: {
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
          ordinal: 1,
        },
      },
    },
    addCounter: {
      kind: "resolution",

      effect: {
        type: "optional",
        effect: {
          type: "add-counter",
          counter: {
            kind: "named",
            name: "gold",
          },
          count: 1,
          target: {
            selector: "object",
            declared: "at-resolution",
            zones: ["permanent"],
            filter: {
              name: "Treasure Island",
            },
            count: 1,
          },
        },
      },
    },
  }),
});

export const {
  red: chartACourseRed,
  yellow: chartACourseYellow,
  blue: chartACourseBlue,
} = chartACourse.cards;
