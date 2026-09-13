import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/bolting-blade.generated.ts";

export const boltingBlade = definePitchFamily(fabPitchFamilies["bolting-blade"], {
  abilities: () => ({
    boltingBladeCostsLessPlayEachTimeVeCharged: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "modify-numeric",
        property: "cost",
        op: "subtract",
        amount: {
          type: "count",
          what: "charged-this-way",
          per: "turn",
        },
        target: {
          selector: "self",
        },
        duration: "permanent",
      },
    },
  }),
});
export const { yellow: boltingBladeYellow } = boltingBlade.cards;
