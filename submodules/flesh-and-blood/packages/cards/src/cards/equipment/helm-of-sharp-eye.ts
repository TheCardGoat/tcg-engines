import { battleworn } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/helm-of-sharp-eye.generated.ts";

export const helmOfSharpEye = defineCard(fabCardIdentitiesByCanonicalId["MfBtnKK96JRR8Nb7RWMBn"], {
  keywords: [battleworn],
  abilities: {
    attackReactionDestroyBanishTopDeckMayPlayCombat: {
      kind: "activated",
      abilityType: "attack-reaction",
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
      // Printed: weapon attack (attacking weapon) with current {p} > 2× base.
      // Prior model used a supertype name-residue string that never matched.
      condition: {
        type: "control-object",
        filter: {
          and: [
            {
              typeBox: {
                types: ["Weapon"],
              },
            },
            {
              hasStatus: "attacking",
            },
            {
              hasStatus: "power-greater-than-twice-base",
            },
          ],
        },
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "banish",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["deck"],
              position: "top",
              count: 1,
            },
            outputBinding: "it",
          },
          {
            type: "play-card",
            fromZones: ["banished"],
            source: {
              selector: "binding",
              binding: "it",
            },
            duration: "this-combat-chain",
          },
        ],
      },
    },
  },
});
