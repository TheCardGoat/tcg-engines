import { cloaked } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/aqua-seeing-shell.generated.ts";

export const aquaSeeingShell = defineCard(fabCardIdentitiesByCanonicalId["NbbDrzwLMP7CH69PHcWfK"], {
  keywords: [cloaked],
  abilities: {
    instantTurnFaceUpDraw: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "asset",
            type: "resources",
            amount: 3,
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
        type: "draw",
        count: 1,
        player: "controller",
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
});
