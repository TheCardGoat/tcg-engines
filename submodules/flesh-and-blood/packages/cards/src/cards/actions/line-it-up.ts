import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/line-it-up.generated.ts";

export const lineItUp = definePitchFamily(fabPitchFamilies["line-it-up"], {
  keywords: [goAgain],
  abilities: () => ({
    nextArrowAttackTurnGets3Power: {
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
              subtypes: ["Arrow"],
            },
          },
        },
      },
    },
    turnFaceDownArrowArsenalFaceUpPutAimCounter: {
      kind: "resolution",
      effect: {
        type: "optional",
        effect: {
          type: "turn-face-up",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["arsenal"],
            filter: {
              hasStatus: "face-down",
              typeBox: {
                subtypes: ["Arrow"],
              },
            },
            count: 1,
          },
          outputBinding: "it",
        },
        then: {
          type: "add-counter",
          counter: {
            kind: "named",
            name: "aim",
          },
          count: 1,
          target: {
            selector: "binding",
            binding: "it",
          },
        },
      },
    },
  }),
});

export const { yellow: lineItUpYellow } = lineItUp.cards;
