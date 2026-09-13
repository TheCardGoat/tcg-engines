import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/rise-above.generated.ts";

export const riseAbove = definePitchFamily(fabPitchFamilies["rise-above"], {
  abilities: () => ({
    alternativeCost: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "alternative-cost",
        cost: {
          class: "effect",
          type: "move-to-deck",
          from: "hand",
          position: "top",
          count: 1,
        },
        optional: true,
      },
    },
  }),
});

export const { red: riseAboveRed, yellow: riseAboveYellow, blue: riseAboveBlue } = riseAbove.cards;
