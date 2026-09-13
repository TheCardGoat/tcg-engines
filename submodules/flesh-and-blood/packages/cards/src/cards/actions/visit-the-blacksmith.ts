import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/visit-the-blacksmith.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const visitTheBlacksmith = definePitchFamily(fabPitchFamilies["visit-the-blacksmith"], {
  keywords: [goAgain],
  abilities: () => ({
    nextSwordAttackTurnGainsNumber1Power: {
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
              subtypes: ["Sword"],
            },
          },
        },
      },
    },
  }),
});

export const { blue: visitTheBlacksmithBlue } = visitTheBlacksmith.cards;
