import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/locked-and-loaded.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const lockedAndLoaded = definePitchFamily(fabPitchFamilies["locked-and-loaded"], {
  parameters: {
    red: { value1: 3, value2: 1 },
    yellow: { value1: 2, value2: 1 },
    blue: { value1: 1, value2: 1 },
  },
  keywords: [goAgain],
  abilities: ({ value1, value2 }) => ({
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
              supertypes: ["Mechanologist"],
              types: ["Action"],
              subtypes: ["Attack"],
            },
          },
        },
      },
    },
    performedThisTurnBoostOpt: {
      kind: "resolution",
      condition: { type: "performed-this-turn", event: "boost", player: "controller" },
      effect: {
        type: "opt",
        count: value2,
      },
    },
  }),
});

export const {
  red: lockedAndLoadedRed,
  yellow: lockedAndLoadedYellow,
  blue: lockedAndLoadedBlue,
} = lockedAndLoaded.cards;
