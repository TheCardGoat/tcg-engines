import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/vigilant-dodgers.generated.ts";

export const vigilantDodgers = defineCard(fabCardIdentitiesByCanonicalId["gFpfBH7cRPMKwQ6WNhWC8"], {
  abilities: {
    instantDestroyPreventNext1DamageWouldBeDealt: {
      kind: "activated",
      abilityType: "instant",
      cost: { class: "effect", type: "destroy-self" },
      condition: {
        type: "compare-amount",
        amount: {
          type: "count",
          what: "weapon-attacks-this-turn",
          // Printed "a weapon has attacked this turn" — unqualified, so any
          // seated weapon (the common case: the attacking hero's weapon).
          player: "any",
        },
        comparison: { op: "gte", value: 1 },
      },
      effect: {
        type: "prevention",
        preventionKind: "fixed",
        amount: 1,
        shielded: { selector: "controller" },
        duration: "this-turn",
      },
    },
  },
});
