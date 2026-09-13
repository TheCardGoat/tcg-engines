import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/lead-with-heart.generated.ts";

export const leadWithHeart = definePitchFamily(fabPitchFamilies["lead-with-heart"], {
  parameters: { red: 3, yellow: 2, blue: 1 },
  supertypeSets: [["Guardian"], ["Warrior"]],
  keywords: [goAgain],
  abilities: (amount) => ({
    modifyNumericPowerThisTurn: {
      kind: "resolution",

      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            or: [
              {
                typeBox: {
                  supertypes: ["Guardian"],
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
    createTokenVigor: {
      kind: "resolution",

      effect: {
        type: "create-token",
        token: "vigor",
        controller: "controller",
      },
    },
  }),
});

export const {
  red: leadWithHeartRed,
  yellow: leadWithHeartYellow,
  blue: leadWithHeartBlue,
} = leadWithHeart.cards;
