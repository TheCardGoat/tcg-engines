import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/vigorous-windup.generated.ts";

export const vigorousWindup = definePitchFamily(fabPitchFamilies["vigorous-windup"], {
  supertypeSets: [["Guardian"], ["Warrior"]],
  abilities: () => ({
    activatedCreateToken: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "discard-self",
      },
      effect: {
        type: "create-token",
        token: "vigor",
        controller: "controller",
      },
    },
  }),
});

export const {
  red: vigorousWindupRed,
  yellow: vigorousWindupYellow,
  blue: vigorousWindupBlue,
} = vigorousWindup.cards;
