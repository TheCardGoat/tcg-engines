import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/agile-windup.generated.ts";

export const agileWindup = definePitchFamily(fabPitchFamilies["agile-windup"], {
  supertypeSets: [["Brute"], ["Warrior"]],

  abilities: () => ({
    createTokenAgilityActivation: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "discard-self",
      },
      effect: {
        type: "create-token",
        token: "agility",
        controller: "controller",
      },
    },
  }),
});
export const {
  red: agileWindupRed,
  yellow: agileWindupYellow,
  blue: agileWindupBlue,
} = agileWindup.cards;
