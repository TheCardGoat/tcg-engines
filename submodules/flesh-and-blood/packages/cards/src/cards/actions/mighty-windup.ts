import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/mighty-windup.generated.ts";

export const mightyWindup = definePitchFamily(fabPitchFamilies["mighty-windup"], {
  supertypeSets: [["Brute"], ["Guardian"]],
  abilities: () => ({
    instantDiscardSelfCreateTokenMight: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "discard-self",
      },
      effect: {
        type: "create-token",
        token: "might",
        controller: "controller",
      },
    },
  }),
});

export const {
  red: mightyWindupRed,
  yellow: mightyWindupYellow,
  blue: mightyWindupBlue,
} = mightyWindup.cards;
