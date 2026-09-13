import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/meteoric-impact.generated.ts";

/**
 * Model notes (hand-authored): Starfall replaces 3 with 5 if an instant entered
 * your graveyard this turn (`per: "turn"` on the instant GY count).
 */
export const meteoricImpact = definePitchFamily(fabPitchFamilies["meteoric-impact"], {
  abilities: (_parameter, { pitch }) => ({
    conditionalZoneCountDealDamageDealDamageStarfall: {
      kind: "resolution",
      effect: {
        type: "conditional",
        condition: {
          type: "zone-count",
          zone: "graveyard",
          player: "controller",
          filter: {
            typeBox: {
              types: ["Instant"],
            },
          },
          comparison: {
            op: "gte",
            value: 1,
          },
          per: "turn",
        },
        then: {
          type: "deal-damage",
          damageType: "arcane",
          amount: 6 - Number(pitch),
          target: {
            selector: "any-hero",
          },
        },
        else: {
          type: "deal-damage",
          damageType: "arcane",
          amount: 4 - Number(pitch),
          target: {
            selector: "any-hero",
          },
        },
      },
      label: {
        name: "starfall",
      },
    },
  }),
});

export const {
  red: meteoricImpactRed,
  yellow: meteoricImpactYellow,
  blue: meteoricImpactBlue,
} = meteoricImpact.cards;
