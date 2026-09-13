import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/re-charge.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const reCharge = definePitchFamily(fabPitchFamilies["re-charge"], {
  parameters: {
    red: { value1: 1, value2: 1, value3: 4 },
    yellow: { value1: 1, value2: 1, value3: 3 },
    blue: { value1: 1, value2: 1, value3: 2 },
  },
  keywords: [goAgain],
  abilities: ({ value1, value2, value3 }) => ({
    addCounterSteamHyperDriver: {
      kind: "resolution",
      effect: {
        type: "add-counter",
        counter: {
          kind: "named",
          name: "steam",
        },
        count: value1,
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["permanent"],
          filter: {
            name: "Hyper Driver",
          },
          count: value2,
        },
      },
    },
    modifyNumericPowerThisTurn: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: value3,
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
  }),
});

export const { red: reChargeRed, yellow: reChargeYellow, blue: reChargeBlue } = reCharge.cards;
