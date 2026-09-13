import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/killjoy-the-crooked-blade.generated.ts";

export const killjoyTheCrookedBlade = defineCard(
  fabCardIdentitiesByCanonicalId["9ngQ9QRpcTPQtpcnjwrRw"],
  {
    abilities: {
      attackAnyOpposingHero: {
        kind: "static",
        staticKind: "continuous",
        effect: {
          type: "rule-modification",
          mode: "allow",
          action: "attack-target",
          target: "any-opposing-hero",
          duration: "while-in-arena",
        },
      },
      wheneverStealGoldCrowdBoos: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "move-zone",
            actor: { kind: "player", player: "ability-controller" },
            observes: {
              kind: "event-object",
              selector: "moved-object",
              relationship: { kind: "controller", player: "ability-controller" },
              filter: { name: "Gold", typeBox: { metatypes: ["Token"] } },
            },
            reason: "steal",
          },
        },
        resolution: { kind: "effect", effect: { type: "crowd-boos", target: "controller" } },
        label: { name: "the-crowd-boos" },
      },
      firstTimeCrowdBoosTurnMoreLifeThanLoses1Life: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "crowd-boos",
            actor: { kind: "player", player: "ability-controller" },
            observes: { kind: "none" },
          },
        },
        limit: { count: 1, per: "turn", ordinals: [1] },
        resolution: {
          kind: "effect",
          effect: {
            type: "for-each",
            target: { selector: "each-other-hero" },
            effect: {
              type: "conditional",
              condition: {
                type: "life-comparison",
                player: "iteration-subject",
                vs: "controller",
                op: "gt",
              },
              then: { type: "lose-life", amount: 1, target: { selector: "iteration-subject" } },
            },
          },
        },
      },
    },
  },
);
