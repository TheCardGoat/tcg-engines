import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/lead-with-power.generated.ts";

export const leadWithPower = definePitchFamily(fabPitchFamilies["lead-with-power"], {
  supertypeSets: [["Brute"], ["Guardian"]],
  keywords: [goAgain],
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
            or: [
              {
                typeBox: {
                  supertypes: ["Brute"],
                },
              },
              {
                typeBox: {
                  supertypes: ["Guardian"],
                },
              },
            ],
          },
        },
      },
    },
    createTokenMight: {
      kind: "resolution",

      effect: {
        type: "create-token",
        token: "might",
        controller: "controller",
      },
    },
  }),
});

export const {
  red: leadWithPowerRed,
  yellow: leadWithPowerYellow,
  blue: leadWithPowerBlue,
} = leadWithPower.cards;
