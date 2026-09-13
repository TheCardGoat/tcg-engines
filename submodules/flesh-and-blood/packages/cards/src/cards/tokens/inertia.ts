import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/tokens/inertia.generated.ts";

export const inertia = defineCard(fabCardIdentitiesByCanonicalId.G6kbCqnBzwjhrb88Q6K7w, {
  abilities: {
    bottomHandAndArsenalAtEndPhase: {
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
              type: "move-card",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["hand", "arsenal"],
                count: {
                  type: "all",
                },
              },
              to: {
                zone: "deck",
                position: "bottom",
              },
            },
          ],
        },
      },
    },
  },
});
