import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/celestial-cataclysm.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const celestialCataclysm = definePitchFamily(fabPitchFamilies["celestial-cataclysm"], {
  keywords: [goAgain],
  abilities: () => ({
    asAdditionalCostPlayBanish3FromSoul: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "additional-cost",
        cost: {
          class: "effect",
          type: "banish",
          from: "soul",
          count: 3,
        },
      },
    },
  }),
});
export const { yellow: celestialCataclysmYellow } = celestialCataclysm.cards;
