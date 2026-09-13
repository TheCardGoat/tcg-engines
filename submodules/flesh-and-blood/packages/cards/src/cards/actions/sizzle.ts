import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/sizzle.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const sizzle = definePitchFamily(fabPitchFamilies["sizzle"], {
  parameters: { red: 3, yellow: 2 },
  keywords: [goAgain],
  abilities: (amount) => ({
    empowerNextLightningOrElementalAttack: {
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
                  supertypes: ["Lightning"],
                },
              },
              {
                typeBox: {
                  supertypes: ["Elemental"],
                },
              },
            ],
          },
        },
      },
    },
  }),
});

export const { red: sizzleRed, yellow: sizzleYellow } = sizzle.cards;
