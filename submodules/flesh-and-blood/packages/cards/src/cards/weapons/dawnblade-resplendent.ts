import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/dawnblade-resplendent.generated.ts";

export const dawnbladeResplendent = defineCard(
  fabCardIdentitiesByCanonicalId["kTzjGBrWbwncJCt7wLTrH"],
  {
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
      secondTimeAttackTurnGets1PowerEndTurn: {
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
              kind: "source",
              selector: "attack",
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
          ordinals: [2],
        },
      },
    },
  },
);
