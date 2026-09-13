import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/tokens/ponder.generated.ts";

export const ponder = defineCard(fabCardIdentitiesByCanonicalId.HpWqFJW8ftTDdzCLK9RkD, {
  abilities: {
    destroyAndDrawAtEndPhase: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "end-phase",
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
              type: "draw",
              count: 1,
              player: "controller",
            },
          ],
        },
      },
    },
  },
});
