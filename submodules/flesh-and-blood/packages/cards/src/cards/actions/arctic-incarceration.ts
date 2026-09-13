import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/arctic-incarceration.generated.ts";

export const arcticIncarceration = definePitchFamily(fabPitchFamilies["arctic-incarceration"], {
  parameters: pitchMap({ red: { count: 3 }, yellow: { count: 2 }, blue: { count: 1 } }),
  abilities: ({ count }) => ({
    resolutionCreateTokenFrostbite: {
      kind: "resolution",
      effect: {
        type: "create-token",
        token: "frostbite",
        controller: "target-controller",
        target: { selector: "any-hero" },
        count,
      },
    },
  }),
});

export const {
  red: arcticIncarcerationRed,
  yellow: arcticIncarcerationYellow,
  blue: arcticIncarcerationBlue,
} = arcticIncarceration.cards;
