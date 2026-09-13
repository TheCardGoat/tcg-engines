import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/demi-heroes/blasmophet-levia-consumed.generated.ts";
import { legendary } from "../shared/keywords.ts";

export const blasmophetLeviaConsumed = defineCard(
  fabCardIdentitiesByCanonicalId.dbrfzmNJ9ccB9CW68pmQp,
  {
    keywords: [
      legendary,
      {
        name: "specialization",
        hero: "Levia",
      },
    ],
    abilities: {
      transformWhenBloodDebtReachesThreshold: {
        kind: "static",
        staticKind: "triggered",
        functionalZones: ["inventory"],
        trigger: {
          kind: "event-and-state",
          event: {
            name: "lose-life",
            actor: {
              kind: "any",
            },
            observes: {
              kind: "none",
            },
          },
          state: {
            type: "and",
            conditions: [
              {
                type: "life-comparison",
                player: "self",
                vs: "fixed",
                op: "eq",
                value: 13,
              },
              {
                type: "has-status",
                status: "in-your-inventory",
              },
            ],
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "optional",
            effect: {
              type: "transform",
              target: {
                selector: "self",
              },
              into: "blasmophet-levia-consumed",
            },
          },
        },
        label: {
          name: "transform",
        },
      },
      playBloodDebtFromBanish: {
        kind: "static",
        staticKind: "play",
        limit: {
          count: 1,
          per: "turn",
        },
        playEffect: {
          role: "permission",
          fromZones: ["banished"],
          filter: {
            hasKeyword: "blood-debt",
          },
        },
        label: {
          name: "transform",
        },
      },
      turnBanishedCardsFaceDown: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "banish",
            actor: {
              kind: "any",
            },
            observes: {
              kind: "event-object",
              selector: "moved-object",
              relationship: {
                kind: "zone-owner",
                player: "ability-controller",
              },
              bindAs: "it",
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "turn-face-down",
            target: {
              selector: "binding",
              binding: "it",
            },
          },
        },
      },
      replaceBloodDebtLifeLoss: {
        kind: "static",
        staticKind: "continuous",
        effect: {
          type: "replacement",
          replacementKind: "standard",
          replaces: {
            name: "lose-life",
            player: "controller",
            source: "blood-debt",
          },
          modification: {
            type: "banish",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["deck"],
              position: "top",
              count: 1,
            },
          },
          duration: "while-in-arena",
        },
        label: {
          name: "replacement",
        },
      },
    },
  },
);
