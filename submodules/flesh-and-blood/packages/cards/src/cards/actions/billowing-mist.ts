import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/billowing-mist.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const billowingMist = definePitchFamily(fabPitchFamilies["billowing-mist"], {
  keywords: [goAgain],
  abilities: () => ({
    nextAttackTurnGets1: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
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
        },
      },
    },
    nextTimeWouldCreateEphemeralTurnInsteadCreateMany: {
      kind: "resolution",
      effect: {
        type: "replacement",
        replacementKind: "standard",
        replaces: {
          name: "create",
          creator: "controller",
          occurrences: "first",
          filter: {
            hasKeyword: "ephemeral",
          },
        },
        modification: {
          type: "create-extra",
          amount: 1,
        },
        duration: "this-turn",
      },
    },
  }),
});
export const { blue: billowingMistBlue } = billowingMist.cards;
