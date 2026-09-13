import { grantKeyword } from "@tcg/flesh-and-blood-types";

import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/become-the-cup.generated.ts";

import { goAgain } from "../shared/keywords.ts";

const abilities = {
  grantProperty: {
    kind: "resolution",
    effect: {
      type: "sequence",
      steps: [
        {
          type: "choose-color",
        },
        {
          type: "grant-property",
          property: {
            kind: "color",
            value: "chosen",
          },
          target: {
            selector: "self",
          },
          duration: "permanent",
        },
        grantKeyword(goAgain, { target: { selector: "self" } }),
      ],
    },
  },
} as const;

export const becomeTheCup = definePitchFamily(fabPitchFamilies["become-the-cup"], {
  abilities: () => ({ ...abilities }),
});

export const {
  red: becomeTheCupRed,
  yellow: becomeTheCupYellow,
  blue: becomeTheCupBlue,
} = becomeTheCup.cards;
