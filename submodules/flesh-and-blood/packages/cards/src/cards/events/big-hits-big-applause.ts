import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/events/big-hits-big-applause.generated.ts";

export const bigHitsBigApplause = defineCard(fabCardIdentitiesByCanonicalId.jzkqdWBRMj7Hp8hQj8tDp, {
  abilities: {
    drawOnClashWin: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "delayed-trigger",
        trigger: {
          kind: "event",
          event: {
            name: "clash-win",
            actor: {
              kind: "any",
            },
            observes: {
              kind: "none",
            },
          },
        },
        policy: {
          kind: "windowed",
          duration: "this-turn",
          matching: "every",
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "draw",
            count: 1,
            player: "winner",
          },
        },
      },
      label: {
        name: "clash",
      },
    },
    clashEachOpponent: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "clash",
        with: {
          selector: "object",
          declared: "at-resolution",
          player: "opponent",
          zones: ["hero"],
          count: {
            type: "all",
          },
        },
      },
      label: {
        name: "clash",
      },
    },
  },
});
