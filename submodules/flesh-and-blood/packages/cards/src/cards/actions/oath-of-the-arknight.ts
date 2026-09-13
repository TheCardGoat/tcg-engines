import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/oath-of-the-arknight.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const oathOfTheArknight = definePitchFamily(fabPitchFamilies["oath-of-the-arknight"], {
  parameters: { red: 3, yellow: 2, blue: 1 },
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
            typeBox: {
              supertypes: ["Runeblade"],
            },
          },
        },
      },
    },
    createTokenRunechant: {
      kind: "resolution",
      effect: {
        type: "create-token",
        token: "runechant",
        controller: "controller",
      },
    },
  }),
});

export const {
  red: oathOfTheArknightRed,
  yellow: oathOfTheArknightYellow,
  blue: oathOfTheArknightBlue,
} = oathOfTheArknight.cards;
