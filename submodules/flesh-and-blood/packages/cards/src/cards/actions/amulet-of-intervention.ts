import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/amulet-of-intervention.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const amuletOfIntervention = definePitchFamily(fabPitchFamilies["amulet-of-intervention"], {
  keywords: [goAgain],
  abilities: () => ({
    instantDestroyAmuletInterventionPreventNext1DamageWould: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      condition: {
        type: "compare-amount",
        amount: {
          type: "count",
          what: "pending-damage-to-hero",
          player: "controller",
        },
        comparison: {
          op: "gte",
          value: { type: "hero-property", property: "life", player: "controller" },
        },
      },
      effect: {
        type: "prevention",
        preventionKind: "fixed",
        amount: 1,
        shielded: {
          selector: "controller",
        },
        duration: "this-turn",
      },
    },
  }),
});
export const { blue: amuletOfInterventionBlue } = amuletOfIntervention.cards;
