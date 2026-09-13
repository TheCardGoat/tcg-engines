import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/fletch-a-red-tail.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const fletchARedTail = definePitchFamily(fabPitchFamilies["fletch-a-red-tail"], {
  keywords: [goAgain],
  abilities: () => ({
    nextArrowAttackTurnGains4: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 4,
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
    ifHasAimCounterGainsRedHave1While: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "has-counter",
        counter: {
          kind: "named",
          name: "aim",
        },
        target: {
          selector: "self",
        },
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            id: "redHave1WhileDefending",
            text: "",
            kind: "resolution",
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
                  color: ["red"],
                  defending: true,
                },
                count: {
                  type: "all",
                },
              },
              duration: "while-condition",
            },
          },
        },
        target: {
          selector: "self",
        },
        duration: "permanent",
      },
    },
  }),
});
export const { red: fletchARedTailRed } = fletchARedTail.cards;
