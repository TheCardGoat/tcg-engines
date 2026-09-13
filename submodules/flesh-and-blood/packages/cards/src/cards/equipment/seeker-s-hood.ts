import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/seeker-s-hood.generated.ts";

export const seekerSHood = defineCard(fabCardIdentitiesByCanonicalId["t9hhCk9PrwgchGMcLkRMt"], {
  abilities: {
    instantDestroySeekerSHoodPreventNext1Damage: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "asset",
            type: "resources",
            amount: 1,
          },
          {
            class: "effect",
            type: "destroy-self",
          },
        ],
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "prevention",
            preventionKind: "fixed",
            amount: 1,
            shielded: {
              selector: "controller",
            },
            duration: "this-turn",
          },
          {
            type: "opt",
            count: 1,
          },
        ],
      },
    },
  },
});
