import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/gas-up.generated.ts";
import { goAgain } from "../shared/keywords.ts";
export const gasUp = definePitchFamily(fabPitchFamilies["gas-up"], {
  parameters: pitchMap({
    red: { value1: 4, value2: 1 },
    yellow: { value1: 3, value2: 1 },
    blue: { value1: 2, value2: 1 },
  }),
  keywords: [goAgain],
  abilities: ({ value1, value2 }) => ({
    resolutionModifyNumericPower: {
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
              subtypes: ["Attack"],
            },
            hasStatus: "boosted",
          },
        },
      },
    },
    resolutionOptionalMove: {
      kind: "resolution",
      effect: {
        type: "optional",
        effect: {
          type: "move-card",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["banished"],
            filter: {
              name: "Hyper Driver",
            },
            count: value2,
          },
          to: {
            zone: "permanent",
          },
        },
      },
    },
  }),
});
export const { red: gasUpRed, yellow: gasUpYellow, blue: gasUpBlue } = gasUp.cards;
