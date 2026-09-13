import { overpower } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/merciless-battleaxe.generated.ts";

export const mercilessBattleaxe = defineCard(
  fabCardIdentitiesByCanonicalId["nGkpNDKckjzwbzBqM7N8f"],
  {
    abilities: {
      oncePerTurnActionResourceResourceResourceAtttack: {
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
      attacksAttacksPowerGreaterThanTwiceBaseAttackGetsOverpower: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event-and-state",
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
          state: {
            type: "object-numeric-comparison",
            property: "power",
            left: "current",
            op: "gt",
            right: "base",
            multiplier: 2,
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "grant-property",
            property: {
              kind: "keyword",
              keyword: overpower,
            },
            target: {
              selector: "this-attack",
            },
            duration: "this-turn",
          },
        },
      },
    },
  },
);
