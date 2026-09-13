import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/overturn-the-results.generated.ts";

export const overturnTheResults = definePitchFamily(fabPitchFamilies["overturn-the-results"], {
  abilities: () => ({
    failWinClashRevealingInsteadWinClashCrowdBoos: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "replacement",
        replacementKind: "outcome",
        replaces: {
          name: "clash-outcome",
          subject: "self",
        },
        modification: {
          type: "sequence",
          steps: [
            {
              type: "win-clash",
            },
            {
              type: "crowd-boos",
              target: "controller",
            },
          ],
        },
        duration: "permanent",
      },
    },
  }),
});

export const { blue: overturnTheResultsBlue } = overturnTheResults.cards;
