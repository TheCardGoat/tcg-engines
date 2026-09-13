import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/laced-lightning.generated.ts";

export const lacedLightning = defineCard(fabCardIdentitiesByCanonicalId["Kb99nwFrrpTQJTpqN6kCt"], {
  abilities: {
    instantDestroyPreventNext1DamageWouldBeDealt: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "asset",
            type: "resources",
            amount: 2,
          },
          {
            class: "effect",
            type: "destroy-self",
          },
        ],
      },
      // Same apply-time follow-up as Constella Tiara (OMN142).
      effect: {
        type: "prevention",
        preventionKind: "fixed",
        amount: 1,
        shielded: {
          selector: "controller",
        },
        duration: "this-turn",
        additionalModification: {
          type: "create-token",
          token: "embodiment-of-lightning",
          controller: "controller",
        },
      },
    },
  },
});
