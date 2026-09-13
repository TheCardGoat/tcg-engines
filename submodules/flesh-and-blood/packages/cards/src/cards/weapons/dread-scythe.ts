import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/dread-scythe.generated.ts";

export const dreadScythe = defineCard(fabCardIdentitiesByCanonicalId["cpF9wnTcmHLtGWND7hbKF"], {
  abilities: {
    oncePerTurnActionResourceResourceResourceAttack: {
      kind: "activated",
      limit: {
        count: 1,
        per: "turn",
      },
      abilityType: "attack",
      cost: {
        class: "asset",
        type: "resources",
        amount: 3,
      },
      effect: {
        type: "attack-with",
        target: {
          selector: "self",
        },
      },
    },
    wheneverAttackDreadScytheDeal1ArcaneDamageDefending: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "attack",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "event-object",
            selector: "attack",
            relationship: {
              kind: "any",
            },
            filter: {
              name: "Dread Scythe",
            },
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "deal-damage",
          damageType: "arcane",
          amount: 1,
          target: {
            selector: "defending-hero",
          },
        },
      },
    },
    dealtDamageDreadScytheCantGainLifeDuringNextActionPhase: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "dealt-damage",
          actor: { kind: "any" },
          observes: {
            kind: "source",
            selector: "damage-source",
          },
          target: { kind: "hero" },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "rule-modification",
          mode: "restrict",
          action: "gain-life",
          subject: {
            selector: "object",
            declared: "at-resolution",
            player: { binding: "damage-target-controller" },
            zones: ["hero"],
            filter: { typeBox: { types: ["Hero"] } },
            count: { type: "all" },
          },
          duration: "during-their-next-action-phase",
        },
      },
    },
  },
});
