import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/helio-s-mitre.generated.ts";

export const helioSMitre = defineCard(fabCardIdentitiesByCanonicalId["gjgpkHgC6p7HNTPpCJdCh"], {
  abilities: {
    instantPreventNext1DamageWouldBeDealtHero: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "asset",
        type: "resources",
        amount: 2,
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "prevention",
            preventionKind: "shielding",
            amount: 1,
            shielded: {
              selector: "controller",
            },
            source: {
              selector: "object",
              declared: "on-stack",
              player: "any",
              zones: [
                "hero",
                "permanent",
                "weapon",
                "equipment-arms",
                "equipment-chest",
                "equipment-head",
                "equipment-legs",
                "combat-chain",
                "stack",
              ],
              count: 1,
            },
            duration: "this-turn",
          },
          {
            type: "destroy",
            target: {
              selector: "self",
            },
            delay: "end-phase",
          },
        ],
      },
    },
  },
});
