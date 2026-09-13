import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/hexagore-the-death-hydra.generated.ts";

export const hexagoreTheDeathHydra = defineCard(
  fabCardIdentitiesByCanonicalId["zCRpPtm9BTfzBJFNkdpNw"],
  {
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
      wheneverAttackHexagoreDealsDamageEqual6MinusNumberBloodDebtBanishedZone: {
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
            type: "deal-damage",
            damageType: "generic",
            amount: {
              type: "difference",
              operands: [
                6,
                {
                  type: "count",
                  what: "cards-in-zone",
                  zone: "banished",
                  player: "controller",
                  filter: {
                    hasKeyword: "blood-debt",
                  },
                },
              ],
            },
            target: {
              selector: "controller",
            },
          },
        },
      },
    },
  },
);
