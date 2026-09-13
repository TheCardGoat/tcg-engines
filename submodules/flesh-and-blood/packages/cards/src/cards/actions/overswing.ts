import { goAgain, heave } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/overswing.generated.ts";

export const overswing = definePitchFamily(fabPitchFamilies["overswing"], {
  keywords: [goAgain, heave(2)],
  abilities: () => ({
    modifyNumericPowerThisTurn: {
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
              supertypes: ["Guardian"],
              types: ["Action"],
              subtypes: ["Attack"],
            },
          },
        },
      },
    },
  }),
});

export const { red: overswingRed, yellow: overswingYellow, blue: overswingBlue } = overswing.cards;
