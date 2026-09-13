import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/dissolve-reality.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const dissolveReality = definePitchFamily(fabPitchFamilies["dissolve-reality"], {
  keywords: [goAgain],
  abilities: () => ({
    eachHeroPutsAllTheirArsenalBottomTheirDeck: {
      kind: "resolution",
      effect: {
        type: "for-each",
        target: {
          selector: "each-hero",
        },
        effect: {
          type: "sequence",
          steps: [
            {
              type: "move-card",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "iteration-subject",
                zones: ["arsenal"],
                count: {
                  type: "all",
                },
              },
              to: {
                zone: "deck",
                position: "bottom",
              },
            },
            {
              type: "create-token",
              token: "ponder",
              controller: "iteration-subject",
            },
          ],
        },
      },
    },
  }),
});
export const { yellow: dissolveRealityYellow } = dissolveReality.cards;
