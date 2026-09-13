import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/cash-in.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const cashIn = definePitchFamily(fabPitchFamilies["cash-in"], {
  keywords: [goAgain],
  abilities: () => ({
    mayDestroy4Coppers2Silvers1GoldControl: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "alternative-cost",
        cost: {
          class: "effect",
          type: "destroy",
          count: 4,
          filter: {
            name: "Coppers, 2 Silvers, Or 1 Gold",
          },
        },
        optional: true,
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
export const { yellow: cashInYellow } = cashIn.cards;
