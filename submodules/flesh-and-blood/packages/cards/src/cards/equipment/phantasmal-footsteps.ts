import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/phantasmal-footsteps.generated.ts";

export const phantasmalFootsteps = defineCard(
  fabCardIdentitiesByCanonicalId["HDKn8nJQDRBKdgdTcjqh9"],
  {
    abilities: {
      whenIllusionistAttackActionControlIsDestroyedMayPay: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "destroy",
            actor: {
              kind: "any",
            },
            observes: {
              kind: "event-object",
              selector: "moved-object",
              relationship: {
                kind: "any",
              },
              filter: {
                and: [
                  {
                    typeBox: {
                      supertypes: ["Illusionist"],
                    },
                  },
                  {
                    typeBox: {
                      subtypes: ["Attack"],
                    },
                  },
                  {
                    typeBox: {
                      types: ["Action"],
                    },
                  },
                ],
              },
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "optional",
            effect: {
              type: "pay",
              cost: {
                class: "asset",
                type: "resources",
                amount: 1,
              },
              payer: "controller",
            },
            then: {
              type: "gain-action-points",
              amount: 1,
            },
          },
        },
        limit: {
          count: 1,
          per: "turn",
        },
      },
      wheneverDefendsMayPayIfDoBecomes1Until: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "defend",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "source",
              selector: "defender",
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "optional",
            effect: {
              type: "pay",
              cost: {
                class: "asset",
                type: "resources",
                amount: 1,
              },
              payer: "controller",
            },
            then: {
              type: "modify-numeric",
              property: "defense",
              op: "set",
              amount: 1,
              target: {
                selector: "self",
              },
              duration: "this-turn",
            },
          },
        },
      },
      whenIsDefendingNonIllusionistAttack6MoreDestroy: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "defend",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "source",
              selector: "defender",
            },
            defendedAttack: {
              typeBox: {
                subtypes: ["Attack"],
                excludeSupertypes: ["Illusionist"],
              },
              power: {
                op: "gte",
                value: 6,
              },
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "delayed-trigger",
            trigger: {
              kind: "event",
              event: {
                name: "combat-chain-close",
                actor: {
                  kind: "none",
                },
                observes: {
                  kind: "none",
                },
              },
            },
            policy: {
              kind: "windowed",
              duration: "this-combat-chain",
              matching: "first",
            },
            resolution: {
              kind: "effect",
              effect: {
                type: "destroy",
                target: {
                  selector: "self",
                },
              },
            },
          },
        },
      },
    },
  },
);
