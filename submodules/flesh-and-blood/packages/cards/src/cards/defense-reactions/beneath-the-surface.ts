import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/beneath-the-surface.generated.ts";
import { wateryGrave } from "../shared/keywords.ts";

export const beneathTheSurface = definePitchFamily(fabPitchFamilies["beneath-the-surface"], {
  keywords: [wateryGrave],
  abilities: () => ({
    turnFaceDownAfterDefending: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "put-into-graveyard",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "event-object",
            selector: "moved-object",
            relationship: {
              kind: "any",
            },
            bindAs: "it",
          },
        },
        state: {
          type: "has-status",
          status: "defending",
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
  }),
});

export const { yellow: beneathTheSurfaceYellow } = beneathTheSurface.cards;
