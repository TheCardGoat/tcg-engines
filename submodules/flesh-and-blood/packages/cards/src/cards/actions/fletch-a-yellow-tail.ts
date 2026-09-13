import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/fletch-a-yellow-tail.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const fletchAYellowTail = definePitchFamily(fabPitchFamilies["fletch-a-yellow-tail"], {
  keywords: [goAgain],
  abilities: () => ({
    nextArrowAttackTurnGains3: {
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
    ifHasAimCounterGainsYellowHave1While: {
      kind: "resolution",
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            id: "yellowHave1WhileDefending",
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
                  color: ["yellow"],
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
export const { yellow: fletchAYellowTailYellow } = fletchAYellowTail.cards;
