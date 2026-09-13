import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/uprising.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const uprising = definePitchFamily(fabPitchFamilies["uprising"], {
  keywords: [goAgain],
  abilities: () => ({
    nextNumber4DraconicAttacksTurnGainNumber1Power: {
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
              supertypes: ["Draconic"],
            },
          },
          count: 4,
        },
      },
    },
  }),
});

export const { red: uprisingRed } = uprising.cards;
