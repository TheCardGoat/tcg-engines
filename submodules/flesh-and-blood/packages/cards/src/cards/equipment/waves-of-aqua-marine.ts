import { cloaked } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/waves-of-aqua-marine.generated.ts";

export const wavesOfAquaMarine = defineCard(
  fabCardIdentitiesByCanonicalId["zmtr9qmT89RLcGDGLRgLM"],
  {
    keywords: [cloaked],
    abilities: {
      attackReactionTurnFaceUpTargetAttackGets1: {
        kind: "activated",
        abilityType: "attack-reaction",
        cost: {
          class: "mixed",
          type: "all",
          costs: [
            {
              class: "asset",
              type: "resources",
              amount: 1,
            },
            {
              class: "effect",
              type: "turn-face-up",
              target: {
                selector: "self",
              },
            },
          ],
        },
        effect: {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: 1,
          target: {
            selector: "object",
            declared: "on-stack",
            zones: ["combat-chain"],
            filter: {
              typeBox: {
                subtypes: ["Attack"],
              },
            },
            count: 1,
          },
          duration: "this-turn",
          outputBinding: "it",
        },
      },
      atStartTurnDestroy: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "start-phase",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "none",
            },
          },
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
);
