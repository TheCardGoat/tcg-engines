import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/romping-club.generated.ts";

export const rompingClub = defineCard(fabCardIdentitiesByCanonicalId["QT8JfjzmzqRR9MWgtgPLR"], {
  abilities: {
    oncePerTurnActionResourceResourceAttack: {
      kind: "activated",
      limit: {
        count: 1,
        per: "turn",
      },
      abilityType: "attack",
      cost: {
        class: "asset",
        type: "resources",
        amount: 2,
      },
      effect: {
        type: "attack-with",
        target: {
          selector: "self",
        },
      },
    },
    oncePerTurnEffectDiscard6MorePowerRompingClubGains1PowerEndTurn: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "discard",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "event-object",
            selector: "discarded-card",
            relationship: {
              kind: "any",
            },
            filter: {
              numeric: [
                { property: "power", basis: "current", comparison: { op: "gte", value: 6 } },
              ],
            },
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: 1,
          target: {
            selector: "self",
          },
          duration: "this-turn",
        },
      },
      limit: {
        count: 1,
        per: "turn",
      },
    },
  },
});
