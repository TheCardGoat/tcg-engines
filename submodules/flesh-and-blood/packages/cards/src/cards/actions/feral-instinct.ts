import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/feral-instinct.generated.ts";

export const feralInstinct = definePitchFamily(fabPitchFamilies["feral-instinct"], {
  abilities: () => ({
    ifVeIntimidatedOpponentTurnCostsLessPlay: {
      kind: "static",
      staticKind: "play",
      condition: {
        type: "performed-this-turn",
        event: "intimidate-an-opponent",
        player: "controller",
      },
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
export const { yellow: feralInstinctYellow } = feralInstinct.cards;
