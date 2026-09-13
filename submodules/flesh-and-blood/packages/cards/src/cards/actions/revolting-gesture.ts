import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/revolting-gesture.generated.ts";

export const revoltingGesture = definePitchFamily(fabPitchFamilies["revolting-gesture"], {
  keywords: [goAgain],
  abilities: () => ({
    nextAttackTurnGets3Power: {
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
        },
      },
    },
    createMightToken: {
      kind: "resolution",
      effect: {
        type: "create-token",
        token: "might",
        controller: "controller",
      },
    },
  }),
});

export const { red: revoltingGestureRed } = revoltingGesture.cards;
