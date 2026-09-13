import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/galaxxi-black.generated.ts";

export const galaxxiBlack = defineCard(fabCardIdentitiesByCanonicalId["r8Bq8zBCNdzGPkmMcr6QL"], {
  abilities: {
    oncePerTurnActionResourceAttack: {
      kind: "activated",
      limit: {
        count: 1,
        per: "turn",
      },
      abilityType: "attack",
      cost: {
        class: "asset",
        type: "resources",
        amount: 1,
      },
      effect: {
        type: "attack-with",
        target: {
          selector: "self",
        },
      },
    },
    playedBanishedZoneTurnGalaxxiBlackGains2PowerEndTurn: {
      kind: "static",
      staticKind: "continuous",
      condition: { type: "played-this", per: "turn", filter: { playedFromZones: ["banished"] } },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 2,
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
    galaxxiBlackHitsDeal1ArcaneDamage: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "hit",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
          target: {
            kind: "hero",
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
            selector: "attack-target",
          },
        },
      },
    },
  },
});
