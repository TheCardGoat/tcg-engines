import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/tome-of-harvests.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const tomeOfHarvests = definePitchFamily(fabPitchFamilies["tome-of-harvests"], {
  keywords: [goAgain],
  abilities: () => ({
    asAdditionalCostPlayTomeHarvestsPutFromArsenalOnBottomDeck: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "additional-cost",
        cost: {
          class: "effect",
          type: "move-to-deck",
          from: "arsenal",
          position: "bottom",
          count: 1,
        },
      },
    },
    drawNumber3: {
      kind: "resolution",
      effect: {
        type: "draw",
        count: 3,
        player: "controller",
      },
    },
  }),
});

export const { blue: tomeOfHarvestsBlue } = tomeOfHarvests.cards;
