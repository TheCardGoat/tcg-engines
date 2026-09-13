import { bloodDebt } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/mutated-mass.generated.ts";

export const mutatedMass = definePitchFamily(fabPitchFamilies["mutated-mass"], {
  keywords: [bloodDebt],
  abilities: () => ({
    playMutatedMassBanishedZone: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "permission",
        fromZones: ["banished"],
      },
    },
    mutatedMasssPowerDefenseEqualTwiceNumberPitchZoneDifferentCosts: {
      kind: "static",
      staticKind: "property",
      property: "power",
      value: {
        type: "double",
        operands: [
          {
            type: "count",
            what: "distinct-costs",
            zone: "pitch",
            player: "controller",
          },
        ],
      },
    },
    mutatedMasssPowerDefenseEqualTwiceNumberPitchZoneDifferentCostsPropertyDefenseDoubleCount: {
      kind: "static",
      staticKind: "property",
      property: "defense",
      value: {
        type: "double",
        operands: [
          {
            type: "count",
            what: "distinct-costs",
            zone: "pitch",
            player: "controller",
          },
        ],
      },
    },
  }),
});

export const { blue: mutatedMassBlue } = mutatedMass.cards;
