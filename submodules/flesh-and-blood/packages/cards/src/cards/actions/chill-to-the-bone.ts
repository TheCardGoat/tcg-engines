import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/chill-to-the-bone.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const chillToTheBone = definePitchFamily(fabPitchFamilies["chill-to-the-bone"], {
  parameters: pitchMap({ red: { count: 3 }, yellow: { count: 2 }, blue: { count: 1 } }),
  keywords: [goAgain],
  abilities: ({ count }) => ({
    resolutionCreateTokenFrostbite: {
      kind: "resolution",
      effect: {
        type: "create-token",
        token: "frostbite",
        controller: "attack-target",
        count,
        appliesTo: {
          next: {
            or: [
              { typeBox: { subtypes: ["Attack"], supertypes: ["Ice"] } },
              { typeBox: { subtypes: ["Attack"], supertypes: ["Elemental"] } },
            ],
          },
        },
      },
    },
  }),
});

export const {
  red: chillToTheBoneRed,
  yellow: chillToTheBoneYellow,
  blue: chillToTheBoneBlue,
} = chillToTheBone.cards;
