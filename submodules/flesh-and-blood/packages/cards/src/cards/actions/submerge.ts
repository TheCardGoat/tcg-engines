import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/submerge.generated.ts";

export const submerge = definePitchFamily(fabPitchFamilies["submerge"], {
  abilities: () => ({
    playFromArsenal: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "additional-cost",
        cost: {
          class: "effect",
          type: "move-to-deck",
          from: "hand",
          position: {
            index: 5,
          },
          count: 1,
        },
      },
    },
  }),
});
export const { red: submergeRed, yellow: submergeYellow, blue: submergeBlue } = submerge.cards;
