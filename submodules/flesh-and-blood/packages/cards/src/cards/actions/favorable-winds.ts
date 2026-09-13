import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/favorable-winds.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const favorableWinds = definePitchFamily(fabPitchFamilies["favorable-winds"], {
  keywords: [goAgain],
  abilities: () => ({
    additionalCostDiscardGoldfinHarpoon: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "additional-cost",
        cost: {
          class: "effect",
          type: "discard",
          count: 1,
          filter: { name: "Goldfin Harpoon" },
        },
      },
    },
    draw2: {
      kind: "resolution",
      effect: {
        type: "draw",
        count: 2,
        player: "controller",
      },
    },
  }),
});

export const { yellow: favorableWindsYellow } = favorableWinds.cards;
