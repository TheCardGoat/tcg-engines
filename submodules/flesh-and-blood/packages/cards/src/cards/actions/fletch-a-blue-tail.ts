import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/fletch-a-blue-tail.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const fletchABlueTail = definePitchFamily(fabPitchFamilies["fletch-a-blue-tail"], {
  keywords: [goAgain],
  abilities: () => ({
    nextArrowAttackTurnGains2: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 2,
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
    ifHasAimCounterGainsBlueHave1While: {
      kind: "resolution",
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            id: "blueHave1WhileDefending",
            text: "",
            kind: "static",
            staticKind: "continuous",
            effect: {
              type: "modify-numeric",
              property: "defense",
              op: "subtract",
              amount: 1,
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "any",
                zones: ["combat-chain"],
                filter: {
                  color: ["blue"],
                  defending: true,
                },
                count: {
                  type: "all",
                },
              },
              duration: "this-chain-link",
            },
          },
        },
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              subtypes: ["Arrow"],
            },
            hasCounter: "aim",
          },
        },
      },
    },
  }),
});
export const { blue: fletchABlueTailBlue } = fletchABlueTail.cards;
