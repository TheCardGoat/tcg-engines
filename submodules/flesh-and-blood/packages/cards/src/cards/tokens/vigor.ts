import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/tokens/vigor.generated.ts";

export const vigor = defineCard(fabCardIdentitiesByCanonicalId.DBhPCQqjnj6qqd9DtBB7W, {
  abilities: {
    gainResourceAtStartOfTurn: {
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
          type: "sequence",
          steps: [
            {
              type: "destroy",
              target: {
                selector: "self",
              },
            },
            {
              type: "gain-resources",
              amount: 1,
            },
          ],
        },
      },
    },
  },
});
