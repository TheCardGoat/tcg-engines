import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/crowd-goes-wild.generated.ts";

export const crowdGoesWild = definePitchFamily(fabPitchFamilies["crowd-goes-wild"], {
  abilities: () => ({
    ifVeBeenCheeredTurnCostsLessPlay: {
      kind: "static",
      staticKind: "play",
      condition: { type: "performed-this-turn", event: "cheered", player: "controller" },
      playEffect: {
        role: "cost-reduction",
        cost: {
          class: "asset",
          type: "resources",
          amount: 3,
        },
      },
    },
  }),
});
export const { yellow: crowdGoesWildYellow } = crowdGoesWild.cards;
