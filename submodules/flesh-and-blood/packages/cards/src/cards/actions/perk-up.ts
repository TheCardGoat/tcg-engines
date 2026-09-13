import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/perk-up.generated.ts";

export const perkUp = definePitchFamily(fabPitchFamilies["perk-up"], {
  keywords: [goAgain],
  abilities: () => ({
    nextMechanologistAttackTurnGets4Power: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 4,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              supertypes: ["Mechanologist"],
            },
          },
        },
      },
    },
    u: {
      kind: "resolution",
      effect: {
        type: "optional",
        effect: {
          type: "untap",
          target: {
            selector: "controller",
          },
        },
      },
    },
  }),
});

export const { red: perkUpRed } = perkUp.cards;
