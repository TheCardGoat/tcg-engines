import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/up-sticks-and-run.generated.ts";

export const upSticksAndRun = definePitchFamily(fabPitchFamilies["up-sticks-and-run"], {
  supertypeSets: [["Assassin"], ["Ninja"]],
  parameters: pitchMap({ red: { value1: 4 }, yellow: { value1: 3 }, blue: { value1: 2 } }),
  keywords: [goAgain],
  abilities: ({ value1 }) => ({
    resolutionOptional: {
      kind: "resolution",
      effect: {
        type: "optional",
        effect: {
          type: "retrieve",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["graveyard"],
            filter: {
              typeBox: {
                subtypes: ["Dagger"],
              },
            },
            count: 1,
          },
          cost: {
            class: "asset",
            type: "resources",
            amount: 1,
          },
          zone: "weapon",
        },
      },
    },
    resolutionModifyNumeric: {
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
  }),
});

export const {
  red: upSticksAndRunRed,
  yellow: upSticksAndRunYellow,
  blue: upSticksAndRunBlue,
} = upSticksAndRun.cards;
