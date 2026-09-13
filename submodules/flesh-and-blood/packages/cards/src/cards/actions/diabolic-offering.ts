import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/diabolic-offering.generated.ts";

import { bloodDebt } from "../shared/keywords.ts";

export const diabolicOffering = definePitchFamily(fabPitchFamilies["diabolic-offering"], {
  keywords: [bloodDebt],
  abilities: () => ({
    if6MoreHasBeenPutIntoBanishedZone: {
      kind: "static",
      staticKind: "property",
      property: "power",
      value: {
        type: "conditional",
        condition: {
          type: "zone-count",
          zone: "banished",
          player: "controller",
          filter: {
            power: {
              op: "gte",
              value: 6,
            },
          },
          per: "turn",
          comparison: {
            op: "gte",
            value: 1,
          },
        },
        then: 6,
        else: 0,
      },
    },
    if6MoreHasBeenPutIntoBanishedZone2: {
      kind: "static",
      staticKind: "property",
      property: "defense",
      value: {
        type: "conditional",
        condition: {
          type: "zone-count",
          zone: "banished",
          player: "controller",
          filter: {
            power: {
              op: "gte",
              value: 6,
            },
          },
          per: "turn",
          comparison: {
            op: "gte",
            value: 1,
          },
        },
        then: 6,
        else: 0,
      },
    },
  }),
});
export const { blue: diabolicOfferingBlue } = diabolicOffering.cards;
