import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/taipanis-dracai-of-judgement.generated.ts";

export const taipanisDracaiOfJudgement = defineCard(
  fabCardIdentitiesByCanonicalId["FtGCjcNCNGg9MkDMwtKCN"],
  {
    abilities: {
      firstTimeTurnAnotherBecomesTargetSourceDealLethalDamageDiscardRedChooseNewTargetsSource: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event-and-state",
          event: {
            name: "attack",
            actor: {
              kind: "any",
            },
            observes: {
              kind: "event-object",
              selector: "attack",
              relationship: {
                kind: "any",
              },
            },
            target: {
              kind: "hero",
              player: "opponent",
            },
          },
          state: {
            type: "compare-amount",
            amount: {
              type: "count",
              what: "pending-damage-to-hero",
              player: "attack-target",
            },
            comparison: {
              op: "gte",
              value: { type: "hero-property", property: "life", player: "attack-target" },
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "optional",
            effect: {
              type: "discard",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["hand"],
                filter: {
                  color: ["red"],
                },
                count: 1,
              },
            },
            then: {
              type: "choose-new-targets",
            },
          },
        },
        limit: {
          count: 1,
          per: "turn",
          ordinals: [1],
        },
      },
    },
  },
);
