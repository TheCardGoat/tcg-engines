import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/allies/cromai.generated.ts";

export const cromai = defineCard(fabCardIdentitiesByCanonicalId.hnnpkTnnFPR76kw7qg7mr, {
  abilities: {
    gainActionPointOnAttack: {
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
          type: "gain-action-points",
          amount: 1,
        },
      },
      limit: {
        count: 1,
        per: "turn",
      },
    },
    gainActionPointOnLeavingArena: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "leave-arena",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "source",
            selector: "moved-object",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "gain-action-points",
          amount: 1,
        },
      },
      limit: {
        count: 1,
        per: "turn",
      },
    },
  },
});
