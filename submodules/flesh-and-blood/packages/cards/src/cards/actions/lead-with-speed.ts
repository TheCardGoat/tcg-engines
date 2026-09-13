import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/lead-with-speed.generated.ts";

export const leadWithSpeed = definePitchFamily(fabPitchFamilies["lead-with-speed"], {
  supertypeSets: [["Brute"], ["Warrior"]],
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
                  supertypes: ["Warrior"],
                },
              },
            ],
          },
        },
      },
    },
    createTokenAgility: {
      kind: "resolution",

      effect: {
        type: "create-token",
        token: "agility",
        controller: "controller",
      },
    },
  }),
});

export const {
  red: leadWithSpeedRed,
  yellow: leadWithSpeedYellow,
  blue: leadWithSpeedBlue,
} = leadWithSpeed.cards;
