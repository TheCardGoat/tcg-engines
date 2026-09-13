import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/ravenous-meataxe.generated.ts";

export const ravenousMeataxe = defineCard(fabCardIdentitiesByCanonicalId["Kfqdk6PhqBd9tKM8T8hmN"], {
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
    wheneverAttackRavenousMeataxeDrawThenDiscardRandom6MorePowerDiscardedWayRavenousMeataxeGains2PowerEndTurn:
      {
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
                name: "Ravenous Meataxe",
              },
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "sequence",
            steps: [
              {
                type: "draw",
                count: 1,
                player: "controller",
              },
              {
                type: "discard",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["hand"],
                  count: 1,
                  random: true,
                },
                outputBinding: "it",
              },
              {
                // Printed "If a card with 6 or more {p} is discarded this way" —
                // bind the discard, then match its power (PEN002 buzzard-helm
                // proven pattern; the discard step already stamps outputBinding
                // "it" — has-status discarded-this-way-card-with-6-or-more-p is
                // never stamped by any reducer).
                type: "conditional",
                condition: {
                  type: "binding-matches",
                  binding: "it",
                  filter: {
                    power: { op: "gte", value: 6 },
                  },
                },
                then: {
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
            ],
          },
        },
      },
  },
});
