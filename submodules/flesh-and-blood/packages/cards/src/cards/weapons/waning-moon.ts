import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/waning-moon.generated.ts";

export const waningMoon = defineCard(fabCardIdentitiesByCanonicalId["kzzwCj8LJwfMf9MTntgtt"], {
  abilities: {
    oncePerTurnInstantResourceResourceDeal2ArcaneDamageTargetNotTurnInsteadDeal3ArcaneDamageActivateAbilityOnlyPlayedNonAttackActionTurn:
      {
        kind: "activated",
        limit: {
          count: 1,
          per: "turn",
        },
        abilityType: "instant",
        cost: {
          class: "asset",
          type: "resources",
          amount: 2,
        },
        condition: {
          type: "performed-this-turn",
          event: "play-non-attack-action",
          player: "controller",
        },
        effect: {
          type: "conditional",
          condition: {
            type: "has-status",
            status: "not-your-turn",
          },
          then: {
            type: "deal-damage",
            damageType: "arcane",
            amount: 3,
            target: { selector: "any-hero" },
          },
          else: {
            type: "deal-damage",
            damageType: "arcane",
            amount: 2,
            target: { selector: "any-hero" },
          },
        },
      },
  },
});
